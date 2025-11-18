import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  Patch, Param
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms') // URL: /rooms
@UseGuards(AuthGuard('jwt')) // <-- 1. "ยาม" เฝ้าทุกประตู (ต้อง Login)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // --- Endpoint (สำหรับ Tenant) ดูห้องและ WiFi ---
  @Get('/my-room') // URL: GET /rooms/my-room
  async getMyRoom(@Request() req) {
    // (ไม่ต้องใช้ RolesGuard เพราะ Tenant ต้องเรียกได้)
    const userId = req.user.id;
    return this.roomsService.findMyRoom(userId);
  }

  // --- Endpoint (สำหรับ Owner) สร้างห้อง ---
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER) // <-- ต้องเป็น OWNER
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  // --- Endpoint (สำหรับ Owner) ผูก User ---
  @Post('/assign-user') // URL: POST /rooms/assign-user
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER) // <-- ต้องเป็น OWNER
  assignUser(@Body() assignUserDto: AssignUserDto) {
    return this.roomsService.assignUserToRoom(assignUserDto);
  }
  // --- Endpoint ใหม่: ดูห้องทั้งหมด (Owner) ---
  @Get() // URL: GET /rooms
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  findAll() {
    return this.roomsService.findAll();
  }

  // --- Endpoint ใหม่: แก้ไขห้อง (Owner) ---
  @Patch(':id') // URL: PATCH /rooms/:id
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }
}