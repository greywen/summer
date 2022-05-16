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
        const client = this.redisService.getClient;
        const _timesheet = await client().get("timesheets");
        let timesheets = <ITimeSheetData[]>JSON.parse(_timesheet || "[]");
        let summary = await client().get("timesheet");
        const result = await FileData.writeTimeSheet(currentDate.format("YYYY-MM-DD"), JSON.stringify({ users: timesheets, summary: summary }));
        if (result) {
            console.log("Save TimeSheet successful!");
            await client().set("timesheets", "[]");
        } else {
            console.log("Save TimeSheet Failed!");
        }
    }
}