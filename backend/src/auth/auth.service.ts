import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterUserDto) {
    // ตรวจสอบ email ซ้ำ
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash รหัสผ่าน (ระบุ type ชัดเจน)
    let hashedPassword: string | null = null;
    if (dto.password) {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    }

    // สร้าง User
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    // ลบ password ก่อน return (ใช้ destructuring)
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}