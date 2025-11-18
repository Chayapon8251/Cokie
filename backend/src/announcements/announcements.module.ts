import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';

@Module({
  controllers: [AnnouncementsController], // 1. บอกว่ามี Controller ตัวไหนบ้าง
  providers: [AnnouncementsService],    // 2. บอกว่ามี Service ตัวไหนบ้าง
})
export class AnnouncementsModule {}