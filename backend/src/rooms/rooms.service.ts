import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  // 1. (สำหรับ Owner) สร้างห้องใหม่
  async create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        roomNumber: dto.roomNumber,
        wifiPassword: dto.wifiPassword,
        price: dto.price,
      },
    });
  }

  // 2. (สำหรับ Owner) ผูก User เข้ากับห้อง
  async assignUserToRoom(dto: AssignUserDto) {
    // เช็กว่า User และ Room มีอยู่จริง
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    const room = await this.prisma.room.findUnique({ where: { id: dto.roomId } });

    if (!user || !room) {
      throw new NotFoundException('User or Room not found');
    }

    // อัปเดต User ให้มี "roomId"
    return this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        roomId: dto.roomId, // <-- นี่คือการ "ผูก" User กับ Room
      },
    });
  }

  // 3. (สำหรับ Tenant) ค้นหาห้องของตัวเอง
  async findMyRoom(userId: string) {
    // ค้นหา User...
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      // ...และ "ดึง" (include) ข้อมูล "room" ที่ผูกอยู่มาด้วย
      include: {
        room: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ถ้า user.room เป็น null (ยังไม่ได้ผูก) ก็จะโยน 404
    if (!user.room) {
      throw new NotFoundException('You are not assigned to any room yet.');
    }

    // คืนค่าเฉพาะ "ข้อมูลห้อง" กลับไป
    return user.room;
  }
  // 4. (สำหรับ Owner) ดูห้องทั้งหมด
  async findAll() {
    return this.prisma.room.findMany({
      orderBy: {
        roomNumber: 'asc', // เรียงตามเลขห้อง
      },
      include: {
        user: true, // ดึงข้อมูลผู้เช่ามาโชว์ด้วยเลย (จะได้รู้ว่าห้องนี้ใครอยู่)
      },
    });
  }

  // 5. (สำหรับ Owner) แก้ไขข้อมูลห้อง (เช่น เปลี่ยนรหัส WiFi)
  async update(id: string, dto: UpdateRoomDto) {
    // เช็กก่อนว่าห้องมีอยู่จริงไหม
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.prisma.room.update({
      where: { id },
      data: {
        ...dto, // อัปเดตเฉพาะฟิลด์ที่ส่งมา
      },
    });
  }
}