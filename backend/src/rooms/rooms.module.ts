import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  controllers: [RoomsController], // <-- 1. "ลงทะเบียน" Controller
  providers: [RoomsService],    // <-- 2. "ลงทะเบียน" Service
})
export class RoomsModule {}