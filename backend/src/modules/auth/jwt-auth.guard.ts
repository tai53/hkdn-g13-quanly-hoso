import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../database/database.service';
import { AuthTokenPayload, AuthenticatedRequest } from './auth.types';

interface SessionRow extends QueryResultRow {
  id: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Vui lòng đăng nhập để tiếp tục');
    }

    let payload: AuthTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<AuthTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    if (!payload.sub || !payload.jti || !payload.username || !payload.roleCode) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    const sessions = await this.db.query<SessionRow>(
      `SELECT s.id
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       JOIN roles r ON r.id = u.role_id
       WHERE s.id = $1 AND s.user_id = $2
         AND s.revoked_at IS NULL AND s.expires_at > NOW()
         AND u.is_active = TRUE AND r.code = $3`,
      [payload.jti, payload.sub, payload.roleCode],
    );
    if (!sessions.length) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    request.user = {
      id: payload.sub,
      username: payload.username,
      roleCode: payload.roleCode,
      jti: payload.jti,
    };
    return true;
  }
}
