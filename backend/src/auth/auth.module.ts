import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'; // <--- 1. Import
import { PassportModule } from '@nestjs/passport'; // <--- 1. Import
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule, // <--- 3. เพิ่ม
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // <--- 4. เพิ่ม "กฎของยาม" เป็น Provider
  ],
})
export class AuthModule {}