import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  // เราไม่ต้อง import PrismaModule เพราะเราตั้งให้มันเป็น @Global แล้ว
})
export class AuthModule {}