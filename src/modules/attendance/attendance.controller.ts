import { Controller, Post, Body, BadRequestException, UnauthorizedException, ForbiddenException, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';
import { CheckEmployeeCheckInDto } from './dto/check-employee-check-in.dto';
import { AlreadyCheckedInException } from '../../shared/exceptions/already-checked-in.exception';
import { Employee } from '../../entities/employees';
import { validateCheckInTime } from '../../utils/validate-check-in-time.util';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('/check-in')
  @Auth()
  async checkIn(@Body() checkInDto: CheckEmployeeCheckInDto, @CurrentUser() currentUser: Employee) {
    const { employee_id, check_in_time } = checkInDto;

    // Check if the employee exists
    const employee = await this.attendanceService.findEmployeeById(employee_id);
    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    // Check if the employee has already checked in
    const hasCheckedIn = await this.attendanceService.checkEmployeeCheckIn(employee_id, new Date(check_in_time));
    if (hasCheckedIn) {
      throw new BadRequestException('Employee has already checked in for the day.');
    }

    // Check if the employee has a login_status of true
    if (employee.login_status) {
      throw new ForbiddenException('Employee has already checked in.');
    }

    // Check if the check-in time is within permissible hours
    const permissibleHours = { start: '08:00', end: '10:00' }; // This should be configurable
    if (!validateCheckInTime(new Date(check_in_time), permissibleHours)) {
      throw new BadRequestException('Check-in is not allowed at this time.');
    }

    // Proceed with check-in logic
    try {
      const checkInRecord = await this.attendanceService.recordCheckIn(employee_id, new Date(check_in_time));
      return {
        status: 200,
        message: 'Check-in recorded successfully.',
        check_in_details: {
          employee_id: checkInRecord.employee_id,
          check_in_time: checkInRecord.check_in_time.toISOString(),
          status: checkInRecord.status
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error has occurred on the server.');
    }
  }
}