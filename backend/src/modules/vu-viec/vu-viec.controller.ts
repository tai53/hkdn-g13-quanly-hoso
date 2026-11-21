import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  // GET /api/vu-viec/:id (kèm danh sách hồ sơ)
  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('id phải là số nguyên') }))
    id: number,
  ) {
    return this.vuViecService.findOne(id);
  }

  // POST /api/vu-viec
  @Post()
  create(@Body() dto: CreateVuViecDto) {
    return this.vuViecService.create(dto);
  }
}
