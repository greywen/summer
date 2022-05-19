import { AttendanceState } from "@constants/dingTalk";
import FileData from "@core/files.data";
import { IAttendances, IUserAttendances } from "@interfaces/dingTalk";
import { ITimeSheetData } from "@interfaces/timesheet";
import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import { RedisService } from "nestjs-redis";

@Injectable()
export class UserService {
    constructor(private readonly redisService: RedisService) { }

    async getTodayTimeSheet(username: string) {
        const data = await this.redisService.getClient().get("timesheets");
        let timesheet = <ITimeSheetData[]>JSON.parse(data || "[]");
        const users = await FileData.readUsers();
        const user = users.find(x => x.name === username);
        const todayTimeSheet = timesheet.find(x => x.userid === user?.id && x.value);
        return todayTimeSheet;
    }

    async getUserAttendanceSummay(username: string) {
        let date = moment().format("YYYY-MM");
        let dingdingAttendances = await FileData.readAttendances(date);
        let customAttendances = await FileData.readCustomAttendances(date);
        let holidays = await FileData.readHolidays(moment().year().toString());
        let attendances = dingdingAttendances.map((ul: IUserAttendances, index: number) => {
            customAttendances[index].attendances.forEach((x: IAttendances[], i) => {
                if (x !== null) {
                    ul.attendances[i] = x;
                }
            })
            return ul;
        })
        const userAttendance = attendances.find(x => x.name === username);
        const attendanceLog = {
            late: 0,
            notCommitReportCount: 0,
            tomorrowIsHoliday: holidays.find(x => x === moment().add(1, "days").format("YYYY-MM-DD")) != null
        }
        userAttendance.attendances.map((_attendance) => {
            _attendance.map(x => {
                if (x.state == AttendanceState.L) {
                    attendanceLog.late += x.value;
                } else if (x.state == AttendanceState.X) {
                    attendanceLog.notCommitReportCount += 1;
                }
            });
        });
        return attendanceLog;
    }

    async getDingTalkUserInfoByName(username: string) {
        const users = await FileData.readUsers();
        return users.find(x => x.name === username);
    }
}