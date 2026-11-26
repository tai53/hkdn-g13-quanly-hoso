
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateAuditLogInput } from './audit-log.types';

@Injectable()
export class AuditLogService {
  constructor(private readonly db: DatabaseService) {}

  async record(input: CreateAuditLogInput): Promise<void> {
    await this.db.query(
      `INSERT INTO audit_logs (
        user_id,
        username,
        case_id,
        action,
        result,
        ip_address
      )
      VALUES ($1, $2, NULL, $3, $4, $5)`,
      [
        input.userId,
        input.username,
        input.action,
        input.result,
        input.ipAddress,
      ],
    );
  }
}
