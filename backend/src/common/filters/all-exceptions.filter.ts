import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

interface PgError {
  code?: string;
  detail?: string;
}

/**
 * Chuẩn hóa mọi lỗi trả về client thành dạng { message: string, ... }.
 * - Lỗi HTTP do code chủ động ném (NotFoundException, BadRequestException...): giữ nguyên mã lỗi.
 * - Lỗi trùng dữ liệu của PostgreSQL (23505): trả 409.
 * - Lỗi khác: ghi log và trả 500.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ERROR');

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      let message = typeof body === 'string' ? body : (body as { message?: string | string[] }).message;
      if (Array.isArray(message)) message = message.join('; ');
      // Đường dẫn không tồn tại: Nest mặc định báo "Cannot GET /..."
      if (status === HttpStatus.NOT_FOUND && message?.startsWith('Cannot ')) {
        message = 'Không tìm thấy đường dẫn';
      }
      res.status(status).json({ message: message || exception.message });
      return;
    }

    const pgErr = exception as PgError;
    if (pgErr?.code === '23505') {
      res.status(HttpStatus.CONFLICT).json({ message: 'Dữ liệu đã tồn tại', detail: pgErr.detail });
      return;
    }

    this.logger.error(exception instanceof Error ? (exception.stack ?? exception.message) : String(exception));
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Lỗi máy chủ' });
  }
}
