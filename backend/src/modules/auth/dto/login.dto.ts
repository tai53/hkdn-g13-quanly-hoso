import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'tiepnhan01' })
  @IsString({ message: 'username phải là chuỗi' })
  @IsNotEmpty({ message: 'username là bắt buộc' })
  @MaxLength(50, { message: 'username tối đa 50 ký tự' })
  username: string;

  @ApiProperty({ example: 'your-password', writeOnly: true })
  @IsString({ message: 'password phải là chuỗi' })
  @IsNotEmpty({ message: 'password là bắt buộc' })
  @MaxLength(128, { message: 'password tối đa 128 ký tự' })
  password: string;
}
