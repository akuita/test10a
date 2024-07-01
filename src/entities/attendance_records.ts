import {
  Entity,
  PrimaryGeneratedColumn, BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Employee } from './employee';
import { UiComponent } from './ui_components';

@Entity('attendance_records')
export class AttendanceRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  updated_at: Date;
  updated_at: Date;

  @Column({ type: 'timestamp' })
  check_in_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out_time: Date;
  @Column({ type: 'enum', enum: ['checked_in', 'checked_out'] })
  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  employee_id: number;

  @ManyToOne(() => Employee, employee => employee.attendance_records)
  employee: Employee;
  employee: Employee;
}