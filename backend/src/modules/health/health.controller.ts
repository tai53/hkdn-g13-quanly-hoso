import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DatabaseService } from '../../database/database.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  // GET /api/health - kiểm tra API và kết nối database
  @Get()
  async check(@Res({ passthrough: true }) res: Response) {
    try {
      const dbTime = await this.db.checkConnection();
      return { status: 'ok', database: 'connected', dbTime };
    } catch (err) {
      const e = err as { message?: string; code?: string };
      res.status(503);
      return { status: 'error', database: 'disconnected', message: e.message || e.code };
    }
  }
}
