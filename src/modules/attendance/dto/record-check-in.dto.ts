import { IsNotEmpty, IsDate, IsInt, IsISO8601 } from 'class-validator';

export class RecordCheckInDto {
  @IsNotEmpty()
  @IsInt()
  employeeId: number;

  @IsNotEmpty()
  @IsISO8601()
  checkInTime: string;

  @IsNotEmpty()
  @IsISO8601()
  date: string;
}