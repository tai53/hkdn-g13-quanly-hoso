import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVuViecDto } from './dto/create-vu-viec.dto';
import { VuViecService } from './vu-viec.service';

@ApiTags('vu-viec')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vu-viec')
export class VuViecController {
  constructor(private readonly vuViecService: VuViecService) {}

  // GET /api/vu-viec
  @Get()
  findAll() {
    return this.vuViecService.findAll();
  }

  // GET /api/vu-viec/:id (nhận UUID hoặc mã hồ sơ HS-2026-0001)
  @Get(':id')
  @ApiParam({
    name: 'id',
    example: '44444444-4444-4444-4444-444444444401',
    description: 'UUID hoặc mã hồ sơ (code)',
  })
  findOne(@Param('id') id: string) {
    return this.vuViecService.findOne(id);
  }

  // POST /api/vu-viec
  @Post()
  create(@Body() dto: CreateVuViecDto) {
    return this.vuViecService.create(dto);
  }
}
