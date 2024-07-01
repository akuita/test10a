import { EntityRepository, Repository } from 'typeorm';
import { AttendanceRecord } from '../entities/attendance_records';

@EntityRepository(AttendanceRecord)
export class AttendanceRecordRepository extends Repository<AttendanceRecord> {
  async findMostRecentCheckIn(employeeId: number): Promise<AttendanceRecord | null> {
    return this.findOne({
      where: { employee_id: employeeId },
      order: { date: 'DESC' },
    });
  }
}