import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { AttendanceRecord } from 'src/entities/attendance_records';
import { Employee } from 'src/entities/employees';
import { AttendanceRecordRepository } from 'src/repositories/attendance-record.repository';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private attendanceRecordRepo: AttendanceRecordRepository,
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

  async recordCheckIn(employeeId: number, currentDate: Date): Promise<any> {
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
      throw new NotFoundException('Invalid employee ID.');
    }

    const hasCheckedIn = await this.checkMultipleCheckIns(employeeId, currentDate);
    if (hasCheckedIn) {
      throw new ConflictException('Employee has already checked in today.');
    }

    const newAttendanceRecord = this.attendanceRecordRepository.create({
      employee_id: employeeId,
      date: currentDate,
      check_in_time: new Date(),
    });

    await this.attendanceRecordRepository.save(newAttendanceRecord);

    return {
      status: 200,
      message: 'Check-in recorded successfully.',
      check_in_disabled: true,
      check_out_enabled: false,
    };
  }
}