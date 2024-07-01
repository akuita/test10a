import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

export function validateCheckInTime(checkInTime: Date, permissibleHours: { start: string; end: string }): boolean {
  const configService = new ConfigService();
  const startTime = configService.get<string>('CHECK_IN_START_TIME') || permissibleHours.start;
  const endTime = configService.get<string>('CHECK_IN_END_TIME') || permissibleHours.end;

  const startOfDay = dayjs(checkInTime).startOf('day');
  const startPermissible = startOfDay.add(dayjs(startTime, 'HH:mm').hour(), 'hour').add(dayjs(startTime, 'HH:mm').minute(), 'minute');
  const endPermissible = startOfDay.add(dayjs(endTime, 'HH:mm').hour(), 'hour').add(dayjs(endTime, 'HH:mm').minute(), 'minute');

  return dayjs(checkInTime).isBetween(startPermissible, endPermissible, null, '[]');
}