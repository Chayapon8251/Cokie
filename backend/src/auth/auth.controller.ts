import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards, // <--- เพิ่ม
  Get,       // <--- เพิ่ม
  Request,
  Req,
  Res,   // <--- เพิ่ม
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth') // URL: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // 2. ลิงก์ที่ Google จะส่ง User กลับมาหาเรา
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const data = await this.authService.googleLogin(req);
  
  // เช็ค Data
    const user = (data as any).user; 
    const token = (data as any).accessToken;

  // ⚠️ จุดสังเกต:
  // 1. ต้อง redirect ไป Frontend (localhost:3000)
  // 2. ต้องไปหน้า /login
  // 3. ต้องส่ง ?token=... (ชื่อ query param ต้องตรงกับที่ Frontend รอรับ)
  
    if (token) {
      // สำหรับ Local
        res.redirect(`http://localhost:3000/login?token=${token}`);
      
      // 💡 ทริค: ถ้าจะให้รองรับ Render ด้วย ต้องแก้ตรงนี้ให้เป็น Dynamic
      // แต่ตอนนี้เอา Local ให้รอดก่อน ใช้ Hardcode ไปเลยครับ
    } else {
        res.redirect(`http://localhost:3000/login?error=true`);
    }
  }
  // ----------------

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