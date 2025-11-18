import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Controller('payments') // URL: /payments
@UseGuards(AuthGuard('jwt')) // <-- 1. "ยาม" เฝ้าทุกประตูในนี้ (ต้อง Login)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // --- Endpoint สำหรับ "Owner" สร้างบิล ---
  @Post()
  @UseGuards(RolesGuard) // <-- 2. ยามชั้นที่สอง (เช็กบทบาท)
  @Roles(UserRole.OWNER) // <-- 3. ต้องเป็น "OWNER"
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  // --- Endpoint สำหรับ "Tenant" ดูประวัติ ---
  @Get('/my-history') // URL: GET /payments/my-history
  findMyHistory(@Request() req) {
    // (Endpoint นี้ไม่ต้องใช้ RolesGuard เพราะเราอยากให้ Tenant เรียกได้)
    const userId = req.user.id; // ดึง ID จาก Token
    return this.paymentsService.findMyHistory(userId);
  }
  
  @Patch(':id/status') // URL: PATCH /payments/:id/status
  @UseGuards(RolesGuard) // ใช้ยามเช็กบทบาท
  @Roles(UserRole.OWNER) // ต้องเป็น OWNER เท่านั้น
  updateStatus(
    @Param('id') id: string, // ดึง id จาก URL
    @Body() dto: UpdatePaymentStatusDto, // ดึง status จาก Body
  ) {
    return this.paymentsService.updateStatus(id, dto.status);
  }
}