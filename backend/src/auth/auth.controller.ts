import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards, // <--- เพิ่ม
  Get,       // <--- เพิ่ม
  Request,   // <--- เพิ่ม
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth') // URL: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') // URL: POST /auth/register
  register(@Body() dto: RegisterUserDto) {
    // NestJS จะ validate ข้อมูลใน dto ให้เราอัตโนมัติ
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK) // <--- 4. บอกว่าถ้าสำเร็จ ให้ส่ง 200 OK
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt')) // <--- 4. สั่งให้ "ยาม" ที่ชื่อ 'jwt' (ที่เราสร้าง) ทำงาน
  @Get('me') // URL: GET /auth/me
  getProfile(@Request() req) {
    // 5. "ยาม" (JwtStrategy) จะถอดรหัส Token 
    //    และแปะ User ไว้ที่ "req.user" ให้เราแล้ว
    return req.user;
  }
}