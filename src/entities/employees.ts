import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttendanceRecord } from './attendance_record';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  // ... other columns ...

  @OneToMany(() => AttendanceRecord, attendanceRecord => attendanceRecord.employee)
  attendanceRecords: AttendanceRecord[];
}