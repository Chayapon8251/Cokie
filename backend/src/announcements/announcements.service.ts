import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  // 1. (สำหรับ Owner) สร้างประกาศใหม่
  async create(dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        content: dto.content,
      },
    });
  }

  // 2. (สำหรับ Tenant) ดูประกาศทั้งหมด
  async findAll() {
    // เรียงจากใหม่สุดไปเก่าสุด
    return this.prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}