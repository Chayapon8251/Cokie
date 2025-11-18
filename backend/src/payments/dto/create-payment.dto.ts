import { IsNotEmpty, IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(2020)
  year: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}