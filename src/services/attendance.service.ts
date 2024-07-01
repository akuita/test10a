import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from 'src/entities/attendance_records';
import { UIComponent } from 'src/entities/ui_components';
import { Employee } from 'src/entities/employees';
import { BaseRepository } from 'src/shared/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
    @InjectRepository(UIComponent)
    private uiComponentRepository: Repository<UIComponent>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async disableCheckInButton(employeeId: number): Promise<string> {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const attendanceRecord = await this.attendanceRecordRepository.findOne({
        where: {
          employee_id: employeeId,
          date: currentDate,
          status: 'checked_in',
        },
      });

      if (attendanceRecord) {
        await this.uiComponentRepository.update(
          { component_name: 'Check in', 'employee.id': employeeId },
          { status: 'disabled' },
        );
        // Ensure 'Checked out' button remains inactive
        await this.uiComponentRepository.update(
          { component_name: 'Checked out', 'employee.id': employeeId },
          { status: 'inactive' },
        );
        return 'Check in button has been disabled.';
      } else {
        throw new Error('No checked-in record found for the employee today.');
      }
    } catch (error) {
      throw new Error(`Failed to disable check-in button: ${error.message}`);
    }
  }
}