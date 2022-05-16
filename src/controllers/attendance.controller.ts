import FileData from '@core/files.data';
import { IAttendanceCustomUpdateDto, IAttendanceUpdateDto } from '@dtos/dingTlak';
import { IAttendances, IUserAttendances } from '@interfaces/dingTalk';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from '@services/attendance.service';
import { formatDate } from '@utils/utils';
import * as moment from 'moment';

@UseGuards(AuthGuard("jwt"))
@Controller("attendance")
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Get("/get")
    async get() {
        const month = moment().format("YYYY-MM");
        let dingdingAttendances = await FileData.readAttendances(month);
        let customAttendances = await FileData.readCustomAttendances(month);
        let attendances = dingdingAttendances.map((ul: IUserAttendances, index: number) => {
            customAttendances[index].attendances.forEach((x: IAttendances[], i) => {
                if (x !== null) {
                    ul.attendances[i] = x;
                }
            })
            return ul;
        })
        return attendances;
    }

    @Put("/update")
    async update(@Body() updateDto: IAttendanceUpdateDto) {
        const { date, day, name } = updateDto;
        let _date = formatDate(date);
        try {
            const result = await this.attendanceService.generateUserAttendances(_date, day, name);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

    @Put("/update/custom")
    async updateCustomAttendance(@Body() updateDto: IAttendanceCustomUpdateDto) {
        let date = moment().format("YYYY-MM");
        const { userId, index, datas } = updateDto;
        let attendances = await FileData.readCustomAttendances(date);
        attendances = attendances.map((x: IUserAttendances) => {
            if (x.id === userId) {
                x.attendances[index] = datas;
            }
            return x;
        });
        const result = await FileData.writeCustomAttendances(date, attendances);
        return result
    }
}
