import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  roomNumber: string; // เช่น "401"

  @IsString()
  @IsNotEmpty()
  wifiPassword: string; // เช่น "4011234"

  @IsNumber()
  @Min(0)
  price: number;
}