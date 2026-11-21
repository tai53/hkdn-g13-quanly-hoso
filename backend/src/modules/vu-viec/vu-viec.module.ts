import { Module } from '@nestjs/common';
import { VuViecController } from './vu-viec.controller';
import { VuViecService } from './vu-viec.service';

// Module mẫu: các module nghiệp vụ khác (ho-so, nguoi-dung, auth...) làm theo đúng cấu trúc này.
@Module({
  controllers: [VuViecController],
  providers: [VuViecService],
})
export class VuViecModule {}
