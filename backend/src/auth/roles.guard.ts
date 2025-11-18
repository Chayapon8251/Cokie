import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client'; // Import Role enum จาก Prisma

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึง "บทบาท" ที่เราต้องการจาก @Roles() decorator (เดี๋ยวเราจะสร้าง)
    const requiredRole = this.reflector.get<UserRole>(
      'role',
      context.getHandler(),
    );

    // 2. ถ้า Endpoint นั้นไม่ได้กำหนด @Roles() ก็ปล่อยผ่าน
    if (!requiredRole) {
      return true;
    }

    // 3. ดึง user ที่ "ยาม" (JwtStrategy) ถอดรหัสมาให้
    const { user } = context.switchToHttp().getRequest();

    // 4. เช็กว่าบทบาทของ user ตรงกับที่ Endpoint ต้องการหรือไม่
    return user.role === requiredRole;
  }
}