import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Dữ liệu client gửi lên khi tạo vụ việc. ValidationPipe tự kiểm tra theo các decorator bên dưới.
// Lưu ý: class-validator chạy decorator từ DƯỚI LÊN, nên đặt điều kiện cơ bản nhất (bắt buộc) ở dưới cùng.
export class CreateVuViecDto {
  @ApiProperty({ example: 'VV-2026-003' })
  @MaxLength(30, { message: 'ma_vu_viec tối đa 30 ký tự' })
  @IsString({ message: 'ma_vu_viec phải là chuỗi' })
  @IsNotEmpty({ message: 'ma_vu_viec là bắt buộc' })
  ma_vu_viec: string;

  @ApiProperty({ example: 'Tiếp nhận đơn kiến nghị' })
  @MaxLength(255, { message: 'tieu_de tối đa 255 ký tự' })
  @IsString({ message: 'tieu_de phải là chuỗi' })
  @IsNotEmpty({ message: 'tieu_de là bắt buộc' })
  tieu_de: string;

  @ApiPropertyOptional()
  @IsString({ message: 'mo_ta phải là chuỗi' })
  @IsOptional()
  mo_ta?: string;

  @ApiPropertyOptional({ example: '2026-11-21', description: 'Bỏ trống thì lấy ngày hiện tại' })
  @IsDateString({}, { message: 'ngay_tiep_nhan phải có dạng YYYY-MM-DD' })
  @IsOptional()
  ngay_tiep_nhan?: string;
}
