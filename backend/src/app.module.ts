import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'; // <--- Import ที่ถูกต้อง
import { AuthModule } from './auth/auth.module';     // <--- Import ที่ถูกต้อง

@Module({
  imports: [
    PrismaModule, // <-- เพิ่มตัวนี้
    AuthModule,   // <-- เพิ่มตัวนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}