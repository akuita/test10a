import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp' })
  check_in_time: Date;

  @Column({ type: 'timestamp' })
  check_out_time: Date;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  employee_id: number;

  @ManyToOne(() => Employee, employee => employee.attendance_records)
  employee: Employee;
}