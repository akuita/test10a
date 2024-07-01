import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from 'src/entities/attendance_records';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
  ) {}

  async checkMultipleCheckIns(employeeId: number, date: Date): Promise<boolean> {
    try {
      const attendanceRecord = await this.attendanceRecordRepository.findOne({
        where: {
          employee_id: employeeId,
          date: date,
          check_in_time: Not(IsNull()),
        },
      });
      return !!attendanceRecord;
    } catch (error) {
      throw new Error('An error occurred while checking multiple check-ins.');
    }
  }
}