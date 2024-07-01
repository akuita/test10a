import { IsNumber, IsDate } from 'class-validator';

export class RecordCheckInDto {
  @IsNumber({}, { message: 'employee_id must be a number' })
  employee_id: number;

  @IsDate({ message: 'check_in_time must be a valid date object' })
  check_in_time: Date;
}