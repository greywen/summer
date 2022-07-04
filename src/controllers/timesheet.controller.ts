import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import FileData from '@core/files.data';
import { ITimeSheet } from '@interfaces/timesheet';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment';

@UseGuards(AuthGuard('jwt'))
@Controller('timesheet')
export class TimeSheetController {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  @Get('/get/:dept_name/:date')
  async getTimesheet(
    @Param('dept_name') dept_name: string,
    @Param('date') date: string,
  ) {
    const templateData = await FileData.readTimeSheetTemplate();
    const users = await FileData.readUsers();
    let datas = <ITimeSheet[]>[];

    if (date === moment().format('YYYY-MM-DD')) {
      const _timesheet = await this.redis.get('timesheets');
      datas = <ITimeSheet[]>JSON.parse(_timesheet || '[]');
    } else {
      try {
        const result = await FileData.readTimeSheet(date);
        datas = <ITimeSheet[]>JSON.parse(result).users;
      } catch (err) {}
    }
    const timeSheetData = users
      .filter((x) => x.dept_name === dept_name)
      .map((x) => {
        const _data = datas.find((d) => d.userid === x.id);
        return {
          userid: x.id,
          name: x.english_name,
          groupid: x.groupid,
          value: _data?.value || '',
          createTime: _data?.createTime || '',
          updateTime: _data?.updateTime || '',
        };
      });

    return {
      template: templateData,
      data: timeSheetData,
    };
  }

  @Put('/update/template')
  async authentication(@Body('template') template: string) {
    return await FileData.writeTimeSheetTemplate(JSON.stringify(template));
  }
}
