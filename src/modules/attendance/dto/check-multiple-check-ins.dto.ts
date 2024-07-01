import { IsNotEmpty, IsDate } from 'class-validator';

export class CheckMultipleCheckInsDto {
  @IsNotEmpty()
  employeeId: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}