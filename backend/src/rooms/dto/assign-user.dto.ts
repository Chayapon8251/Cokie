import { IsNotEmpty, IsString } from 'class-validator';

export class AssignUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // ID ของผู้เช่า

  @IsString()
  @IsNotEmpty()
  roomId: string; // ID ของห้อง
}