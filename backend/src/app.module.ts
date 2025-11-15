import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'; // <--- Import ที่ถูกต้อง
import { AuthModule } from './auth/auth.module';     // <--- Import ที่ถูกต้อง
import { SupportTicketsModule } from './support-tickets/support-tickets.module';

@Module({
  imports: [
    PrismaModule, // <-- เพิ่มตัวนี้
    AuthModule, SupportTicketsModule,   // <-- เพิ่มตัวนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}