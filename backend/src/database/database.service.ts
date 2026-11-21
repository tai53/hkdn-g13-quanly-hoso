import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';
import { env } from '../config/env';

/**
 * Kết nối PostgreSQL dùng chung cho toàn bộ ứng dụng (connection pool).
 * Dùng trong service bất kỳ: constructor(private readonly db: DatabaseService) {}
 */
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger('DB');

  private readonly pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  constructor() {
    this.pool.on('error', (err) => {
      this.logger.error(`Lỗi kết nối không mong muốn: ${err.message}`);
    });
  }

  /** Chạy câu SQL có tham số ($1, $2...) và trả về danh sách dòng. */
  async query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<T[]> {
    const { rows } = await this.pool.query<T>(text, params);
    return rows;
  }

  async checkConnection(): Promise<Date> {
    const rows = await this.query<{ now: Date }>('SELECT NOW() AS now');
    return rows[0].now;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
