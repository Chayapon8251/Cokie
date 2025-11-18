import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client'; // <--- อย่าลืม import อันนี้

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // 1. สร้างบิล
  async create(dto: CreatePaymentDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    return this.prisma.payment.create({
      data: {
        amount: dto.amount,
        month: dto.month,
        year: dto.year,
        userId: dto.userId,
        status: 'PENDING',
      },
    });
  }

  // 2. ดูประวัติ
  async findMyHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        year: 'desc',
      },
    });
  } // <--- ปีกกาปิดของ findMyHistory (คุณน่าจะขาดตัวนี้ หรือวางผิดที่)

  // 3. อัปเดตสถานะ (วางต่อจากข้างบน แต่อยู่ใน Class)
  async updateStatus(id: string, status: PaymentStatus) {
    return this.prisma.payment.update({
      where: { id: id },
      data: { status: status },
    });
  }
  
} // <--- ปีกกาปิดของ Class PaymentsService