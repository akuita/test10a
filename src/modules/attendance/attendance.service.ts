import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../entities/employees';
import { AttendanceRecord } from '../../entities/attendance_records';
import { Repository } from 'typeorm';
import { validateCheckInTime } from '../../utils/validate-check-in-time.util';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordRepository: Repository<AttendanceRecord>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
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

  async recordCheckIn(employeeId: number, checkInTime: Date): Promise<AttendanceRecord> {
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    if (employee.login_status) {
      throw new BadRequestException('Employee has already checked in.');
    }

    const hasCheckedInToday = await this.checkEmployeeCheckIn(employeeId, checkInTime);
    if (hasCheckedInToday) {
      throw new BadRequestException('Employee has already checked in for the day.');
    }

    const permissibleHours = { start: '08:00', end: '17:00' }; // This should be configurable
    if (!validateCheckInTime(checkInTime, permissibleHours)) {
      throw new BadRequestException('Check-in is not allowed at this time.');
    }

    const attendanceRecord = this.attendanceRecordRepository.create({
      employee_id: employeeId,
      check_in_time: checkInTime,
      status: 'checked_in',
      date: checkInTime.toISOString().split('T')[0],
    });

    return this.attendanceRecordRepository.save(attendanceRecord);
  }
}