import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AttendanceService } from 'src/modules/attendance/attendance.service';
import { RecordCheckInDto } from 'src/modules/attendance/dto/record-check-in.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async recordCheckIn(@Body() recordCheckInDto: RecordCheckInDto) {
    const { employeeId, date } = recordCheckInDto;

    // Check if the employee ID is valid
    const isValidEmployee = await this.attendanceService.validateEmployeeId(employeeId);
    if (!isValidEmployee) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid employee ID.',
      };
    }

    // Check for multiple check-ins
    const hasCheckedIn = await this.attendanceService.checkMultipleCheckIns(employeeId, date);
    if (hasCheckedIn) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Employee has already checked in today.',
      };
    }

    // Record the check-in
    try {
      await this.attendanceService.recordCheckIn(employeeId, date);
      return {
        status: HttpStatus.OK,
        message: 'Check-in recorded successfully.',
        check_in_disabled: true,
        check_out_enabled: false,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred on the server.',
      };
    }
  }
}