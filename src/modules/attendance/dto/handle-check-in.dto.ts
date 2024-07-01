import { IsNumber, IsDate } from 'class-validator';

export class HandleCheckInDto {
  @IsNumber({}, { message: 'employeeId must be a number' })
  employeeId: number;

  @IsDate({ message: 'checkInTime must be a valid date' })
  checkInTime: Date;
}