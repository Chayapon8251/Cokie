import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards, // 1. Import UseGuards
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AuthGuard } from '@nestjs/passport'; // 2. Import "ยามเฝ้า Token"
import { RolesGuard } from '../auth/roles.guard'; // 3. Import "ยามเฝ้าบทบาท"
import { Roles } from '../auth/roles.decorator'; // 4. Import Decorator
import { UserRole } from '@prisma/client'; // 5. Import Enum

@Controller('announcements') // URL: /announcements
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // --- Endpoint สำหรับ "Owner" สร้างประกาศ ---
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // 6. ใช้ยาม 2 ชั้น!
  @Roles(UserRole.OWNER) // 7. กำหนดว่าต้องเป็น "OWNER" เท่านั้น
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  // --- Endpoint สำหรับ "Tenant" อ่านประกาศ ---
  @Get()
  @UseGuards(AuthGuard('jwt')) // 8. ใช้ยามแค่ชั้นเดียว (ขอแค่ Login)
  findAll() {
    return this.announcementsService.findAll();
  }
}