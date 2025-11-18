import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional() // <-- ใส่ตัวนี้แปลว่า "ไม่ส่งมาก็ได้" (ไม่แก้)
  @IsString()
  @MaxLength(10)
  roomNumber?: string;

  @IsOptional()
  @IsString()
  wifiPassword?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}