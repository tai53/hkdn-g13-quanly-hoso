import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../database/database.service';
import { LoginDto } from './dto/login.dto';
import { AuthTokenPayload, AuthenticatedUser } from './auth.types';

const TOKEN_TTL_SECONDS = 60 * 60;

interface AccountRow extends QueryResultRow {
  id: string;
  username: string;
  password_hash: string;
  full_name: string;
  role_code: string;
  role_name: string;
  is_active: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const rows = await this.db.query<AccountRow>(
      `SELECT u.id, u.username, u.password_hash, u.full_name,
              r.code AS role_code, r.name AS role_name, u.is_active
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.username = $1`,
      [dto.username],
    );

    const account = rows[0];
    const passwordMatches = account
      ? await bcrypt.compare(dto.password, account.password_hash)
      : false;

    if (!account || !account.is_active || !passwordMatches) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const jti = randomUUID();
    const payload: AuthTokenPayload = {
      jti,
      username: account.username,
      roleCode: account.role_code,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      subject: account.id,
      expiresIn: TOKEN_TTL_SECONDS,
    });

    await this.db.query(
      `INSERT INTO auth_sessions (id, user_id, expires_at)
       VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 second'))`,
      [jti, account.id, TOKEN_TTL_SECONDS],
    );

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: TOKEN_TTL_SECONDS,
      user: {
        id: account.id,
        username: account.username,
        full_name: account.full_name,
        role: {
          code: account.role_code,
          name: account.role_name,
        },
      },
    };
  }

  async logout(user: AuthenticatedUser) {
    await this.db.query(
      `UPDATE auth_sessions
       SET revoked_at = NOW()
       WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL`,
      [user.jti, user.id],
    );
    return { message: 'Đăng xuất thành công' };
  }
}
