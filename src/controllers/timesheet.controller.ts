import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import FileData from '@core/files.data';
import { ITimeSheetData } from '@interfaces/timesheet';
import { RedisService } from 'nestjs-redis';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller("timesheet")
export class TimeSheetController {
    constructor(private readonly redisService: RedisService) { }
    @Get("/get/:dept_name")
    async getTimesheet(@Param("dept_name") dept_name: string) {
        const templateData = await FileData.readTimeSheetTemplate();
        const users = await FileData.readUsers();
        const _timesheet = await this.redisService.getClient().get("timesheets");
        let datas = <ITimeSheetData[]>JSON.parse(_timesheet || "[]");

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
