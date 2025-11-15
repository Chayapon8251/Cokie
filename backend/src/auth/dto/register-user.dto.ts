import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional() // อนุญาตให้เป็นค่าว่างได้ (ตาม Schema)
  name?: string;

  @IsString()
  @IsOptional() // อนุญาตให้เป็นค่าว่างได้ (ตาม Schema)
  @MinLength(6)
  password?: string;
}