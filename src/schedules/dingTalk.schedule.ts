import SMSApi from "@apis/smsApi";
import config from "@config/config";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ReportService } from "@services/report.service";
import * as moment from "moment";

@Injectable()
export class DingTalkSchedule {
    constructor(
        private reportService: ReportService
    ) { }

    @Cron(config.job.reportRule, { name: 'DingTalkReportSchedule' })
    async run() {
        const startTime = moment().format("YYYY-MM-DD 09:00:00");
        const endTime = moment().format("YYYY-MM-DD 21:00:00");
        let users = await this.reportService.getNotCommitReportUsers(startTime, endTime);
        if (users.length === 0) {
            console.log("Everyone submitted a report!");
        }
        for (let user of users) {
            console.log("Not commit report : ", user.name);
            await SMSApi.sendNotCommitReportSMS({ name: user.name, phone: user.phone }, moment().format("YYYY-MM-DD"));
        }
    }
}