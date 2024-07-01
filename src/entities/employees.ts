import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { AttendanceRecord } from './attendance_records';
import { UiComponent } from './ui_components';

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
  @OneToMany(type => AttendanceRecord, attendanceRecord => attendanceRecord.employee, {
    cascade: true
  })
  @JoinColumn({ name: 'employee_id' })


  // Relation with UiComponent is not specified in the ERD, hence not included here.
  @OneToMany(() => AttendanceRecord, attendanceRecord => attendanceRecord.employee)
  attendance_records: AttendanceRecord[];
}