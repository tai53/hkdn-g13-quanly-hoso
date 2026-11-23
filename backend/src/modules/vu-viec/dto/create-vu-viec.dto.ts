import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Dữ liệu client gửi lên khi tạo hồ sơ vụ việc.
// Lưu ý: class-validator chạy decorator từ DƯỚI LÊN, nên đặt điều kiện cơ bản nhất ở dưới cùng.
export class CreateVuViecDto {
  @ApiProperty({ example: 'Vụ việc mất trộm xe máy tại bãi giữ xe khu A' })
  @MaxLength(255, { message: 'tieu_de tối đa 255 ký tự' })
  @IsString({ message: 'tieu_de phải là chuỗi' })
  @IsNotEmpty({ message: 'tieu_de là bắt buộc' })
  tieu_de: string;

  @ApiPropertyOptional({
    example: '2026-11-23T08:30:00+07:00',
    description: 'Thời gian xảy ra vụ việc (bỏ trống sẽ lấy thời điểm hiện tại)',
  })
  @IsDateString({}, { message: 'thoi_gian_vu_viec phải đúng định dạng ngày giờ ISO 8601' })
  @IsOptional()
  thoi_gian_vu_viec?: string;

  @ApiPropertyOptional({ example: 'Bãi giữ xe Khu A, Quận Bình Thạnh, TP.HCM' })
  @MaxLength(255, { message: 'dia_diem tối đa 255 ký tự' })
  @IsString({ message: 'dia_diem phải là chuỗi' })
  @IsOptional()
  dia_diem?: string;

  @ApiPropertyOptional({ example: 'Người dân trình báo mất 01 xe mô tô tại khu vực cổng B.' })
  @IsString({ message: 'tom_tat_vu_viec phải là chuỗi' })
  @IsOptional()
  tom_tat_vu_viec?: string;

  // --- Các trường tùy chọn giữ tương thích ngược với Frontend cũ (VuViecPage.tsx) ---
  @ApiPropertyOptional({ description: 'Không bắt buộc vì hệ thống tự sinh ma_ho_so' })
  @MaxLength(50, { message: 'ma_vu_viec tối đa 50 ký tự' })
  @IsString({ message: 'ma_vu_viec phải là chuỗi' })
  @IsOptional()
  ma_vu_viec?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'mo_ta phải là chuỗi' })
  @IsOptional()
  mo_ta?: string;

  @ApiPropertyOptional({ example: '2026-11-23' })
  @IsDateString({}, { message: 'ngay_tiep_nhan phải có dạng YYYY-MM-DD' })
  @IsOptional()
  ngay_tiep_nhan?: string;
}