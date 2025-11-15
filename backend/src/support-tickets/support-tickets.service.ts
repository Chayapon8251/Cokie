import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';

@Injectable()
export class SupportTicketsService {
  // ฉีด Prisma เข้ามา
  constructor(private prisma: PrismaService) {}

  /**
   * สร้าง Ticket แจ้งปัญหาใหม่
   * @param userId ID ของผู้ใช้ที่แจ้ง (ได้มาจาก Token)
   * @param dto ข้อมูล Ticket (title, details)
   */
  async create(userId: string, dto: CreateSupportTicketDto) {
    // สร้าง Ticket ใหม่ใน DB
    // โดยเชื่อมความสัมพันธ์ (connect) ไปยัง ID ของ User ที่ส่งมา
    const newTicket = await this.prisma.supportTicket.create({
      data: {
        title: dto.title,
        details: dto.details,
        user: {
          connect: { id: userId }, // <-- นี่คือการผูก Ticket กับ User
        },
      },
    });
    return newTicket;
  }
}
