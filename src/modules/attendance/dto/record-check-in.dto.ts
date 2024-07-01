import { IsNotEmpty, IsDate } from 'class-validator';

export class RecordCheckInDto {
  @IsNotEmpty()
  @IsDate()
  employeeId: number;

  @IsNotEmpty()
  @IsDate()
  checkInTime: Date;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}