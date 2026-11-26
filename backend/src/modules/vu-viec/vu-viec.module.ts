import { Module } from '@nestjs/common';
import { VuViecController } from './vu-viec.controller';
import { VuViecService } from './vu-viec.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Module mẫu: các module nghiệp vụ khác (ho-so, nguoi-dung, auth...) làm theo đúng cấu trúc này.
@Module({
  imports: [AuthModule],
  controllers: [VuViecController],
  providers: [VuViecService, JwtAuthGuard],
})
export class VuViecModule {}
