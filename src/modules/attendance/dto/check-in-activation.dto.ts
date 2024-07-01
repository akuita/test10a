import { IsNumber, IsDateString } from 'class-validator';

export class CheckInActivationDto {
  @IsNumber()
  employeeId: number;

  @IsDateString()
  date: Date;
}