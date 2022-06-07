import { AttendanceCheckType } from '@constants/dingTalk';
import FileData from '@core/files.data';
import { Injectable } from '@nestjs/common';
import { unique } from '@utils/utils';
import { DingTalkService } from './dingTalk.service';

@Injectable()
export class ReportService {
  constructor(private readonly dingTalkService: DingTalkService) {}

  async getNotCommitReportUsers(startTime: string, endTime: string) {
    const users = await FileData.readUsers();
    const userIds = users.map((x) => parseInt(x.id));

    // 当天应交日报的员工id
    const usersAttendanceList = await this.dingTalkService.getAttendanceList(
      userIds,
      startTime,
      endTime,
    );
    const onDutyAttendanceUserId = usersAttendanceList
      .filter((punch) => punch.checkType === AttendanceCheckType.OnDuty)
      .map((item) => item.userId);

    const cursor = 0;
    const reports = await this.dingTalkService.getAllReports(
      startTime,
      endTime,
      cursor,
    );
    // 所有已交日报员工的id(去除重复提交的日报)
    let allReportedUserIds = reports.map((report) => report.creator_id);
    allReportedUserIds = unique<string>(allReportedUserIds);
    // 未交日报员工
    const noReportUserIds = onDutyAttendanceUserId.filter(
      (item: string) => !allReportedUserIds.includes(item),
    );

    // 未交日志并且订阅日志提醒的用户
    const noReportUsers = users.filter(
      (x) => noReportUserIds.includes(x.id) && x.phone,
    );
    return noReportUsers;
  }
}
