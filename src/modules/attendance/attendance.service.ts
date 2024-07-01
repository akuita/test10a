import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employees';
import { AttendanceRecord } from '../../entities/attendance_records';
import { RecordEmployeeCheckInDto, RecordEmployeeCheckInResponseDto } from './dtos/record-employee-check-in.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
  ) {}

  async recordEmployeeCheckIn(
    recordEmployeeCheckInDto: RecordEmployeeCheckInDto,
  ): Promise<RecordEmployeeCheckInResponseDto> {
    const { employeeId, checkInTime, date } = recordEmployeeCheckInDto;

    // Validate the employeeId
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
      throw new Error('Invalid employee ID');
    }

    // Check if the employee has already checked in for the current date
    const existingRecord = await this.attendanceRecordRepository.findOneBy({
      employee_id: employeeId,
      date: date,
    });
    if (existingRecord) {
      throw new Error('Employee has already checked in for today');
    }

    // Record the check-in
    const attendanceRecord = this.attendanceRecordRepository.create({
      check_in_time: checkInTime || new Date(),
      date: date,
      employee_id: employeeId,
    });
    await this.attendanceRecordRepository.save(attendanceRecord);

    // Update the is_logged_in status of the employee
    employee.is_logged_in = true;
    await this.employeeRepository.save(employee);

    // Return success message
    return {
      message: 'Check-in recorded successfully',
    };
  }
}