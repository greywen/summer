import { UserTimesheet } from '@entities/timesheet.enetity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectRepository(UserTimesheet)
    private readonly timesheetRepository: Repository<UserTimesheet>,
  ) {}

  async getTimeSheetByDate(createTime: string) {
    const data = await this.timesheetRepository.findOneBy({
      createTime: createTime,
    });
    return data?.timesheet || [];
  }
}
