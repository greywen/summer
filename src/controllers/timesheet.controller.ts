import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import FileData from '@core/files.data';
import { ITimeSheetData } from '@interfaces/timesheet';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { AuthGuard } from '@nestjs/passport';
import * as moment from "moment";

@UseGuards(AuthGuard("jwt"))
@Controller("timesheet")
export class TimeSheetController {
    constructor(@InjectRedis() private readonly redis: Redis) { }
    @Get("/get/:dept_name/:curDate")
    async getTimesheet(@Param("dept_name") dept_name: string, @Param("curDate") curDate: string) {
        const templateData = await FileData.readTimeSheetTemplate();
        const users = await FileData.readUsers();
        let datas = [];

        if (curDate === moment().format("YYYY-MM-DD")) {
            const _timesheet = await this.redis.get("timesheets");
            datas = <ITimeSheetData[]>JSON.parse(_timesheet || "[]");
        } else {
            try {
                const result = await FileData.readTimeSheet(curDate);
                datas = <ITimeSheetData[]>JSON.parse(result).users;
            } catch (err) {
                console.log('error', err);
            }
        }

        let timeSheetData = users.filter(x => x.dept_name === dept_name).map(x => {
            return {
                userid: x.id,
                name: x.english_name,
                groupid: x.groupid,
                value: datas.find(d => d.userid === x.id)?.value || null
            }
        });

        return {
            template: templateData,
            data: timeSheetData
        }
    }

    @Put("/update/template")
    async authentication(@Body("template") template: string) {
        return await FileData.writeTimeSheetTemplate(JSON.stringify(template));
    }
}
