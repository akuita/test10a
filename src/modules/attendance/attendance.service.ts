import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employees';
import { AttendanceRecord } from 'src/entities/attendance_records';
import { BadRequestException } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
  ) {}

  async recordEmployeeCheckIn(employeeId: number, checkInTime: Date): Promise<{ message: string; checkInDetails?: AttendanceRecord } | Error> {
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
      throw new BadRequestException('Employee does not exist.');
    }

    if (employee.login_status) {
      throw new BadRequestException('Employee has already checked in.');
    }

    const today = dayjs().startOf('day').toDate();
    const existingRecord = await this.attendanceRecordRepository.findOne({
      where: {
        employee_id: employeeId,
        date: today,
      },
    });

    if (existingRecord) {
      throw new BadRequestException('Employee has already checked in for the day.');
    }

    const checkInHour = dayjs(checkInTime).hour();
    if (checkInHour < 8 || checkInHour > 17) {
      throw new BadRequestException('Check-in is not allowed at this time.');
    }

    const attendanceRecord = this.attendanceRecordRepository.create({
      employee_id: employeeId,
      check_in_time: checkInTime,
      status: 'checked_in',
      date: today,
    });

    await this.attendanceRecordRepository.save(attendanceRecord);

    employee.login_status = true;
    await this.employeeRepository.save(employee);

    return {
      message: 'Check-in recorded successfully.',
      checkInDetails: attendanceRecord,
    };
  }
}