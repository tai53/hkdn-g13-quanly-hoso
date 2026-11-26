import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateVuViecDto {
  @ApiProperty({ example: 'Mất trộm xe mô tô tại bãi giữ xe Khu A' })
  @MaxLength(255, { message: 'title tối đa 255 ký tự' })
  @IsString({ message: 'title phải là chuỗi' })
  @IsNotEmpty({ message: 'title là bắt buộc' })
  @ValidateIf((o) => !o.tieu_de)
  title?: string;

  @ApiPropertyOptional({ example: '2026-11-24T09:00:00+07:00' })
  @IsDateString({}, { message: 'occurred_at phải đúng định dạng ISO 8601' })
  @IsOptional()
  occurred_at?: string;

  @ApiPropertyOptional({ example: 'Quận Bình Thạnh, TP.HCM' })
  @MaxLength(255, { message: 'location tối đa 255 ký tự' })
  @IsString({ message: 'location phải là chuỗi' })
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Tóm tắt diễn biến ban đầu của vụ việc' })
  @IsString({ message: 'summary phải là chuỗi' })
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ example: '33333333-3333-3333-3333-333333333302' })
  @IsUUID('4', { message: 'assignee_id phải là UUID hợp lệ' })
  @IsOptional()
  assignee_id?: string;

  // --- Trường tùy chọn giữ tương thích ngược với giao diện mẫu cũ ---
  @ApiPropertyOptional()
  @MaxLength(255)
  @IsString()
  @IsOptional()
  tieu_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mo_ta?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  ngay_tiep_nhan?: string;
}