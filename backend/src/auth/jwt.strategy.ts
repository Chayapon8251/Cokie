import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET; // 1. ดึงค่ามาใส่ตัวแปร

    if (!secret) {
      // 2. ถ้าไม่มี ให้แอปพังไปเลย (ดีกว่าปล่อยให้รันแบบไม่ปลอดภัย)
      throw new Error('JWT_SECRET is not set in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // 3. ส่ง secret ที่มั่นใจแล้วว่า "มีค่า"
    });
  }

  // 4. นี่คือ Logic ที่ "ยาม" จะทำ "หลังจาก" ถอดรหัส Token สำเร็จ
  async validate(payload: any) {
    // payload คือข้อมูล (sub, email, role) ที่เรายัดไว้ใน Token ตอน Login

    // 5. (แนะนำ) ตรวจสอบอีกชั้นว่า User นี้ยังมีตัวตนใน DB จริงๆ
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}