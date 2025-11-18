import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  controllers: [PaymentsController], // <-- 1. "ลงทะเบียน" Controller
  providers: [PaymentsService],    // <-- 2. "ลงทะเบียน" Service
})
export class PaymentsModule {}