import { HttpException } from '@nestjs/common';

export class AlreadyCheckedInException extends HttpException {
  constructor() {
    super('Employee has already checked in for the day.', 400);
  }
}