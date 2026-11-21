import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { VuViecModule } from './modules/vu-viec/vu-viec.module';

// Module gốc: khi tạo module nghiệp vụ mới, thêm vào mảng imports.
@Module({
  imports: [DatabaseModule, HealthModule, VuViecModule],
})
export class AppModule {}
