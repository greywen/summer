import config from "@config/config";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AttendanceService } from "@services/attendance.service";
import * as moment from "moment";

@Injectable()
export class DingTalkSchedule {
    constructor(
        private attendanceServive: AttendanceService
    ) { }

    @Cron(config.job.reportRule, { name: 'DingTalkReportSchedule' })
    async run() {
        let _date = moment().add(-1, "days").format("YYYY-MM-DD");
        console.log(`${_date} attendance updating...`);
        try {
            const result = await this.attendanceServive.generateUserAttendances(_date);
            console.log(result ? `${_date} attendance update successful!` : "Attendance update failed!");
        }
        catch (err) {
            console.log(err);
            console.log("Attendance update failed!");
        }
    }
}