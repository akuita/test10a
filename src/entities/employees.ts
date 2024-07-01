import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { AttendanceRecord } from './attendance_records';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  login_status: boolean;

  @OneToMany(() => AttendanceRecord, attendanceRecord => attendanceRecord.employee)
  attendance_records: AttendanceRecord[];
}