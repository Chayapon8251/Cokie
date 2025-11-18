import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '@prisma/client'; // ดึง Enum จาก Prisma โดยตรง

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsEnum(PaymentStatus) // บังคับว่าต้องเป็นค่าใน Enum เท่านั้น (ห้ามมั่ว)
  status: PaymentStatus;
}