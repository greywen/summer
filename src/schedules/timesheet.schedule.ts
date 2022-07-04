import config from '@config/config';
import FileData from '@core/files.data';
import { ITimeSheet } from '@interfaces/timesheet';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTimesheet } from 'src/entities/timesheet.enetity';
import { Repository } from 'typeorm';
import { now } from '@utils/utils';
@Injectable()
export class TimeSheetSchedule {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserTimesheet)
    private readonly timesheetRepository: Repository<UserTimesheet>,
  ) {}

  @Cron(config.job.saveTimeSheetRule, { name: 'SaveTimeSheetSchedule' })
  async run() {
    const currentDate = moment();
    const holidays = await FileData.readHolidays(currentDate.year().toString());
    const isHoliday = holidays.includes(currentDate.format('YYYY-MM-DD'));
    if (isHoliday) {
      return;
    }
    console.log('Saving TimeSheet...');
    const _timesheet = await this.redis.get('timesheets');
    const timesheets = <ITimeSheet[]>JSON.parse(_timesheet || '[]');
    const result = await this.timesheetRepository.save({
      timesheet: timesheets,
      createTime: now(),
    });
    if (result.id) {
      await this.redis.set('timesheets', '[]');
      console.log('Save TimeSheet successful!');
    } else {
      console.log('Save TimeSheet Failed!');
    }
  }
}
