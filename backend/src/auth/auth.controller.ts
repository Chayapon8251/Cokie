import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth') // URL: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') // URL: POST /auth/register
  register(@Body() dto: RegisterUserDto) {
    // NestJS จะ validate ข้อมูลใน dto ให้เราอัตโนมัติ
    return this.authService.register(dto);
  }
}