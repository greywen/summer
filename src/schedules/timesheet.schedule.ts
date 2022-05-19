import config from "@config/config";
import FileData from "@core/files.data";
import { ITimeSheetData } from "@interfaces/timesheet";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as moment from "moment";
import { RedisService } from "nestjs-redis";

@Injectable()
export class TimeSheetSchedule {
    constructor(
        private readonly redisService: RedisService
    ) { }

    @Cron(config.job.saveTimeSheetRule, { name: 'SaveTimeSheetSchedule' })
    async run() {
        const currentDate = moment();
        const holidays = await FileData.readHolidays(currentDate.year().toString());
        let isHoliday = holidays.includes(currentDate.format("YYYY-MM-DD"));
        if (isHoliday) {
            return;
        }
        console.log("Saving TimeSheet...");
        const _timesheet = await this.redisService.getClient().get("timesheets");
        let timesheets = <ITimeSheetData[]>JSON.parse(_timesheet || "[]");
        const result = await FileData.writeTimeSheet(currentDate.format("YYYY-MM-DD"), JSON.stringify({ users: timesheets }));
        if (result) {
            await this.redisService.getClient().set("timesheets", "[]");
            console.log("Save TimeSheet successful!");
        } else {
            console.log("Save TimeSheet Failed!");
        }
    }
}