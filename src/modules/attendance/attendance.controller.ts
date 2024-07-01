import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckEmployeeCheckInDto } from './dto/check-employee-check-in.dto';
import { AlreadyCheckedInException } from '../../shared/exceptions/already-checked-in.exception';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('check-in')
  async checkIn(@Query() checkInDto: CheckEmployeeCheckInDto) {
    const { employee_id, date } = checkInDto;
    const hasCheckedIn = await this.attendanceService.checkEmployeeCheckIn(employee_id, date);

    if (hasCheckedIn) {
      throw new AlreadyCheckedInException('Employee has already checked in for the day.');
    }

    // Proceed with check-in logic
    // This is a placeholder for the actual check-in logic, which may involve creating a new attendance record
    // and other business logic as required by the application.
    // ...

    return { message: 'Check-in successful', status: 'success' };
  }
}