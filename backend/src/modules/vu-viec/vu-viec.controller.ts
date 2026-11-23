import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateVuViecDto } from './dto/create-vu-viec.dto';
import { VuViecService } from './vu-viec.service';

// Controller: định nghĩa route, nhận và kiểm tra dữ liệu đầu vào, gọi service.
@ApiTags('vu-viec')
@Controller('vu-viec')
export class VuViecController {
  constructor(private readonly vuViecService: VuViecService) {}

  // GET /api/vu-viec
  @Get()
  findAll() {
    return this.vuViecService.findAll();
  }

  // GET /api/vu-viec/:maHoSo (kèm diễn biến, tệp đính kèm, đối tượng, phương tiện)
  @Get(':maHoSo')
  @ApiParam({ name: 'maHoSo', example: 'HS-2026-0001', description: 'Mã hồ sơ vụ việc' })
  findOne(@Param('maHoSo') maHoSo: string) {
    return this.vuViecService.findOne(maHoSo);
  }

  // POST /api/vu-viec
  @Post()
  create(@Body() dto: CreateVuViecDto) {
    return this.vuViecService.create(dto);
  }
}