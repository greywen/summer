import { Injectable } from '@nestjs/common';
import FileData from '@core/files.data';
import { IAttendances, IUser, IUserAttendances } from '@interfaces/dingTalk';
import { vacationToEnum } from '@utils/utils';
import * as moment from 'moment';
import DingTalkApi from '../apis/dingTalkApi';
import {
  AttendanceCheckType,
  AttendanceState,
  TimeResultType,
} from '../constants/dingTalk';

interface ITimes {
  start: string;
  end: string;
  work: string;
}
@Injectable()
export class AttendanceService {
  private dingTalkApi: DingTalkApi;
  private holidays: string[];
  private tiems: ITimes;
  private user: IUser;
  private attendances: IAttendances[];

  constructor() {
    this.dingTalkApi = new DingTalkApi();
  }

  private initUserAttendances(
    users: IUser[],
    userAttendances: IUserAttendances[],
    days: number,
  ) {
    const _users = [...users];
    let _userAttendances = [...userAttendances];
    if (_userAttendances.length !== _users.length) {
      // to do 可优化
      _userAttendances = _users.map((user) => {
        const _attendance = _userAttendances.find((x) => x.name);
        return {
          id: user.id,
          name: user.name,
          dept_name: user.dept_name,
          attendances: _attendance
            ? _attendance.attendances
            : Array.from(new Array(days), () => []),
        };
      });
      return _userAttendances;
    }
    return _userAttendances;
  }

  /**
   *
   * @param date 开始日期
   * @param day 生成往日多少天 默认8天
   * @returns string[]
   * date 2020-04-04
   * day 2
   * return [2020-04-03,2020-04-02]
   */
  private prepareAttendanceDates(date, day = 8): string[] {
    const dates = [];
    while (day) {
      dates.push(moment(date).add(-dates.length, 'days').format('YYYY-MM-DD'));
      --day;
    }
    return dates.reverse();
  }

  async generateUserAttendances(date, day = 8, name?: string) {
    const dates = this.prepareAttendanceDates(date, day);
    const firstDate = dates[0];
    const year = moment(firstDate).format('YYYY'),
      month = moment(firstDate).format('YYYY-MM'),
      days = moment(firstDate).daysInMonth();

    const users = await FileData.readUsers();
    this.holidays = await FileData.readHolidays(year);
    let userAttendances = await FileData.readAttendances(month);

    userAttendances = this.initUserAttendances(users, userAttendances, days);
    for (const d of dates) {
      const isHoliday = this.holidays.includes(d);
      for (const user of users) {
        if (name && user.name != name) {
          continue;
        }
        const currentIndex = userAttendances.findIndex(
          (ul) => ul.name === user.name,
        );
        const index = parseInt(moment(d).format('D')) - 1;
        // 节假日
        if (isHoliday) {
          userAttendances[currentIndex].attendances[index] = [];
        } else {
          this.tiems = {
            start: `${d} 00:00:00`,
            end: `${d} 23:59:59`,
            work: `${d} 09:00:00`,
          };
          this.user = user;
          this.attendances = [];
          await this.getUserAttendanceByTimeName();
          await this.getUserReportLog();
          await this.getUserAttendanceLog();
          userAttendances[currentIndex].attendances[index] = this.attendances;
        }
      }
    }
    return await FileData.writeAttendances(month, userAttendances);
  }

  /**
   *
   * @param date
   */
  private findNextNotHolodayDate(date) {
    let tomorrowDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
    let isHoliday = false;
    while (this.holidays.includes(tomorrowDate)) {
      isHoliday = true;
      tomorrowDate = moment(tomorrowDate).add(1, 'days').format('YYYY-MM-DD');
    }
    return {
      date: tomorrowDate,
      isHoliday: isHoliday,
    };
  }

  // 是否请假一天
  private async whetherLeaveOneDay() {
    return (await this.getLeaveTimeByMinutes()) >= 7.5 * 60;
  }

  // 是否请假一天
  private async whetherLeave() {
    return (await this.getLeaveTimeByMinutes()) > 0;
  }

  private async getLeaveTimeByMinutes() {
    const leaveType = [
      AttendanceState.C,
      AttendanceState.P,
      AttendanceState.S,
      AttendanceState.V,
    ];
    const leaveLog = this.attendances.filter((x) =>
      leaveType.includes(x.state),
    );
    return leaveLog.length > 0 ? parseFloat(leaveLog[0].value) * 60 : 0;
  }

  /**
   * 日志记录
   */
  private async getUserReportLog() {
    if (await this.whetherLeaveOneDay()) {
      return;
    }
    if (this.user.groupid >= 1 && this.user.groupid <= 4) {
      return;
    }
    const { date } = this.findNextNotHolodayDate(
      moment(this.tiems.start).format('YYYY-MM-DD'),
    );
    const startTime = moment(this.tiems.start).format('YYYY-MM-DD 00:00:01');
    const endTime = moment(date).format('YYYY-MM-DD 08:59:59');
    const reports = await this.dingTalkApi.getReports(
      startTime,
      endTime,
      0,
      this.user.id,
    );
    if (reports.data_list.length === 0) {
      this.attendances.push({
        state: AttendanceState.X,
      });
    }
  }

  // 统一请假时长单位
  private unifyLeaveTime(name, value) {
    const names = ['丧假', '年假'];
    if (names.includes(name)) {
      return parseFloat(value) * 7.5;
    }
    return value;
  }

  /**
   * 请假记录
   */
  private async getUserAttendanceByTimeName() {
    const types = [
      '调休',
      '事假',
      '病假',
      '年假',
      '产假',
      '陪产假',
      '婚假',
      '例假',
      '丧假',
      '特别假',
    ];
    const data = await this.dingTalkApi.getUserAttendanceLeaveTimeByNames(
      this.user.id,
      types.join(','),
      this.tiems.start,
      this.tiems.end,
    );
    for (const d of data?.columns) {
      if (d.columnvals[0].value != 'null' && d.columnvals[0].value != '0.0') {
        this.attendances.push({
          state: vacationToEnum(d.columnvo.name),
          value: this.unifyLeaveTime(d.columnvo.name, d.columnvals[0].value),
        });
      }
    }
  }

  // 上班下班记录
  private async getUserAttendanceLog() {
    const attendance = await this.dingTalkApi.getUserAttendance(
      this.user.id,
      this.tiems.work,
    );
    const _attendance = { state: AttendanceState.O, value: 0 };
    let subTime = 0;
    let userOffDutyTime = moment(this.tiems.work);

    // 请假一天直接返回
    if (await this.whetherLeaveOneDay()) {
      return;
    }

    // 新入职员工没有打卡记录 （不严谨）
    if (attendance.attendance_result_list.length === 0) {
      this.attendances = [];
      return;
    }

    let onDutyTime = 0;
    let offDutyTime = 0;
    for (const data of attendance.attendance_result_list) {
      if (data.check_type === AttendanceCheckType.OnDuty) {
        subTime = moment(data.plan_check_time).diff(
          moment(data.user_check_time),
          'minutes',
        );
        if (data.time_result === TimeResultType.Late && subTime > 60) {
          subTime += (await this.getLeaveTimeByMinutes()) + 90;
        }
        onDutyTime = data.user_check_time;
      } else if (data.check_type === AttendanceCheckType.OffDuty) {
        // 获取用户上班信息
        const userOnDutyInfo = attendance.attendance_result_list.find(
          (x) => x.check_type === AttendanceCheckType.OnDuty,
        );
        if (userOnDutyInfo) {
          // 计算下班时间 9 = 中午午休1.5小时+上班7.5小时 默认下班时间当天18:00
          userOffDutyTime = moment(userOnDutyInfo.user_check_time).add(
            9,
            'hours',
          );
          const defaultOffDutyTime = moment(userOffDutyTime).format(
            'YYYY-MM-DD 18:00:00',
          );
          if (userOffDutyTime.diff(defaultOffDutyTime) > 0) {
            userOffDutyTime = moment(defaultOffDutyTime);
          }
        }
        subTime = moment(data.user_check_time).diff(userOffDutyTime, 'minutes');
        if (data.time_result === TimeResultType.Early) {
          subTime += (await this.getLeaveTimeByMinutes()) + 90;
        }
        offDutyTime = data.user_check_time;
      }
      if (subTime < 0) {
        _attendance.state = AttendanceState.L;
        _attendance.value += Math.abs(subTime);
      }
    }
    // 没打卡没请假视为异常需要人工审核
    const whetherLeave = await this.whetherLeave();
    const notSigned =
      attendance.attendance_result_list.filter((x) => {
        return x.time_result === TimeResultType.NotSigned;
      }).length >= 2;

    if (notSigned && !whetherLeave) {
      _attendance.state = AttendanceState.Anomalous;
      _attendance.value = null;
    }

    this.attendances.push({
      state: _attendance.state,
      value: _attendance.state === AttendanceState.O ? null : _attendance.value,
    });

    this.attendances.push({
      state: AttendanceState.A,
      value: `${onDutyTime && moment(onDutyTime).format('HH:mm:ss')} - ${
        offDutyTime && moment(offDutyTime).format('HH:mm:ss')
      }`,
    });
  }
}
