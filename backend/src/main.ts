import 'reflect-metadata';
import { env } from './config/env'; // kiểm tra biến môi trường trước, thiếu là dừng ngay
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });

  app.setGlobalPrefix('api');
  app.enableCors({ origin: env.corsOrigin });
  // whitelist: bỏ các trường không khai báo trong DTO; transform: chuyển dữ liệu về đúng kiểu DTO;
  // stopAtFirstError: mỗi trường chỉ báo lỗi đầu tiên gặp phải
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, stopAtFirstError: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Tài liệu API tự sinh: http://localhost:<PORT>/api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Quản lý vụ việc và hồ sơ nghiệp vụ')
    .setDescription('REST API của hệ thống')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(env.port);

  const logger = new Logger('API');
  logger.log(`Đang chạy tại http://localhost:${env.port}`);
  logger.log(`Tài liệu API: http://localhost:${env.port}/api/docs`);

  const dbLogger = new Logger('DB');
  try {
    const now = await app.get(DatabaseService).checkConnection();
    dbLogger.log(`Kết nối PostgreSQL thành công (${now.toISOString()})`);
  } catch (err) {
    const e = err as { message?: string; code?: string };
    dbLogger.error(`Không kết nối được PostgreSQL: ${e.message || e.code}`);
  }
}

void bootstrap();
