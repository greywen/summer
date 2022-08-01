import FileData from '@core/files.data';
import {
  IAttendanceCustomUpdateDto,
  IAttendanceUpdateDto,
} from '@dtos/dingTlak';
import { IAttendances, IUserAttendances } from '@interfaces/dingTalk';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from '@services/attendance.service';
import { formatDate } from '@utils/utils';
import * as moment from 'moment';

@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('/get/:date')
  async get(@Param('date') date?: string) {
    const month = date ? date : moment().format('YYYY-MM');
    const dingdingAttendances = await FileData.readAttendances(month);
    const customAttendances = await FileData.readCustomAttendances(month);
    const attendances = dingdingAttendances.map((ul: IUserAttendances) => {
      customAttendances
        .find((x) => x.id === ul.id)
        .attendances.forEach((x: IAttendances[], i) => {
          if (x !== null) {
            ul.attendances[i] = x;
          }
        });
      return ul;
    });
    return attendances;
  }

  @Put('/update')
  async update(@Body() updateDto: IAttendanceUpdateDto) {
    const { date, day, name } = updateDto;
    const _date = formatDate(date);
    try {
      const result = await this.attendanceService.generateUserAttendances(
        _date,
        day,
        name,
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  @Put('/update/custom')
  async updateCustomAttendance(@Body() updateDto: IAttendanceCustomUpdateDto) {
    const { userId, index, datas, date } = updateDto;
    const _date = moment(date).format('YYYY-MM');
    let attendances = await FileData.readCustomAttendances(_date);
    attendances = attendances.map((x: IUserAttendances) => {
      if (x.id === userId) {
        x.attendances[index] = datas;
      }
      return x;
    });
    const result = await FileData.writeCustomAttendances(_date, attendances);
    return result;
  }
}
