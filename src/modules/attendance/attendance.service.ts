import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from 'src/entities/attendance_records';
import { validateCheckInTime } from 'src/utils/validate-check-in-time.util';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
  ) {}

  async handleCheckIn(employeeId: number, checkInTime: Date) {
    if (!validateCheckInTime(checkInTime)) {
      throw new BadRequestException('Check-in is not allowed during this time.');
    }

    const attendanceRecord = this.attendanceRecordRepository.create({
      employee_id: employeeId,
      check_in_time: checkInTime,
      status: 'checked_in',
      date: new Date().toISOString().split('T')[0], // Assuming date is today's date
    });

    await this.attendanceRecordRepository.save(attendanceRecord);

    return attendanceRecord;
  }
}