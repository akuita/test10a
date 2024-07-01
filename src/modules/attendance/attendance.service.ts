import { BadRequestException, Injectable } from '@nestjs/common';
import { AttendanceRecordRepository } from 'path/to/attendance-record.repository'; // Replace with the actual path
import { AttendanceRecord } from 'src/entities/attendance_records';
import * as dayjs from 'dayjs';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRecordRepository: AttendanceRecordRepository) {}

  async checkEmployeeCheckIn(employeeId: number, date: Date): Promise<void> {
    const mostRecentEntry = await this.attendanceRecordRepository.findMostRecentCheckIn(employeeId);
    if (mostRecentEntry && dayjs(mostRecentEntry.date).isSame(dayjs(date), 'day')) {
      throw new BadRequestException('Employee has already checked in for the day.');
    }
    // If dates are different, do nothing (allow the check-in process to continue)
  }
}