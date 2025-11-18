import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'; // <--- Import ที่ถูกต้อง
import { AuthModule } from './auth/auth.module';     // <--- Import ที่ถูกต้อง
import { SupportTicketsModule } from './support-tickets/support-tickets.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { PaymentsModule } from './payments/payments.module';
import { RoomsModule } from './rooms/rooms.module';


@Module({
  imports: [
    PrismaModule, // <-- เพิ่มตัวนี้
    AuthModule, 
    SupportTicketsModule,
    AnnouncementsModule,
    PaymentsModule,
    RoomsModule,   // <-- เพิ่มตัวนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}