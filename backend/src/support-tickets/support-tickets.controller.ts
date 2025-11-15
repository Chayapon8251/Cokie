import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('support-tickets') // URL: /support-tickets
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Post() // URL: POST /support-tickets
  @UseGuards(AuthGuard('jwt')) // <-- 1. "ยาม" เฝ้าประตูนี้
  create(
    @Request() req, // <-- 2. ดึง Request (ที่มี user)
    @Body() createSupportTicketDto: CreateSupportTicketDto, // <-- 3. ดึง Body
  ) {
    // 4. ดึง ID ของ user ที่ "ยาม" ถอดรหัสมาให้
    const userId = req.user.id;

    // 5. ส่งทั้ง userId และข้อมูล Ticket ไปให้ Service จัดการ
    return this.supportTicketsService.create(userId, createSupportTicketDto);
  }
}
