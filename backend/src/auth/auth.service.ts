import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException, // <--- 1. เพิ่มตัวนี้
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'; // <--- 2. เพิ่มตัวนี้
import { LoginUserDto } from './dto/login-user.dto'; // <--- 3. เพิ่มตัวนี้

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // 4. อัปเดต constructor ให้รับ JwtService
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // <--- เพิ่มตัวนี้
  ) {}

  // --- ฟังก์ชัน Register (ของคุณ) ---
  async register(dto: RegisterUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      let hashedPassword: string | null = null;
      if (dto.password) {
        const saltRounds = 12;
        hashedPassword = await bcrypt.hash(dto.password, saltRounds);
      }

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn(`Email already exists: ${dto.email}`, error.message);
        throw new ConflictException('Email already in use');
      }
      this.logger.error(`Failed to register user: ${dto.email}`, error.stack);
      throw new InternalServerErrorException('Could not complete registration');
    }
  }

  // --- 5. เพิ่มฟังก์ชัน Login (ที่ขาดไป) ---
  async login(dto: LoginUserDto) {
    // ค้นหา User ด้วย email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Login failed: User not found ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // ตรวจสอบรหัสผ่าน
    if (!user.password) {
      this.logger.warn(`Login failed: User has no password ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatch) {
      this.logger.warn(`Login failed: Invalid password ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // สร้าง "บัตรผ่าน" (Payload)
    const payload = {
      sub: user.id, // Subject (ID ของ User)
      email: user.email,
      role: user.role,
    };

    // สร้าง Token
    const accessToken = await this.jwtService.signAsync(payload);

    // ส่ง Token กลับไป
    return {
      accessToken: accessToken,
    };
  }
}