import { IsNumber, IsDate } from 'class-validator';

export class RecordCheckInDto {
  @IsNumber({}, { message: 'employeeId must be a number' })
  employeeId: number;

  @IsDate({ message: 'checkInTime must be a valid date object' })
  checkInTime: Date;
}