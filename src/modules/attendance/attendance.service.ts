import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from '../../entities/attendance_records';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordRepository: Repository<AttendanceRecord>,
  ) {}

  async checkEmployeeCheckIn(employeeId: number, date: Date): Promise<boolean> {
    const attendanceRecord = await this.attendanceRecordRepository.findOne({
      where: {
        employee_id: employeeId,
        date: date.toISOString().split('T')[0], // Format the date to YYYY-MM-DD
        status: 'checked_in',
      },
    });

    return !!attendanceRecord;
  }
}