import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from '../../entities/attendance_records';
import { BaseRepository, QueryCondition, QueryOperators, QueryWhereType } from '../../shared/base.repository';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordRepository: BaseRepository<AttendanceRecord>,
  ) {}

  async checkInActivation(employeeId: number, date: Date): Promise<{ activateCheckout: boolean }> {
    try {
      const conditions: QueryCondition[] = [
        {
          column: 'employee_id',
          value: employeeId,
          operator: QueryOperators.EQUAL,
          whereType: QueryWhereType.WHERE_AND,
        },
        {
          column: 'date',
          value: date,
          operator: QueryOperators.EQUAL,
          whereType: QueryWhereType.WHERE_AND,
        },
        {
          column: 'check_in_time',
          value: null,
          operator: QueryOperators.NOT_EQUAL,
          whereType: QueryWhereType.WHERE_AND,
        },
      ];

      const attendanceRecord = await this.attendanceRecordRepository.getOne({ conditions });

      return { activateCheckout: !!attendanceRecord };
    } catch (error) {
      // If no record is found or any other error occurs, we assume the check-in hasn't happened
      return { activateCheckout: false };
    }
  }
}