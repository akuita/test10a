import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from 'src/entities/attendance_records';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}