import { AttendanceState } from '@constants/dingTalk';
import FileData from '@core/files.data';
import { IAttendances, IUserAttendances } from '@interfaces/dingTalk';
import { ITimeSheet } from '@interfaces/timesheet';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import config from '@config/config';
import { UserDepartment } from '@entities/user.department.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { intersect, now } from '@utils/utils';
import KcClient from '@utils/kcClient';

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserDepartment)
    private readonly departmentRepository: Repository<UserDepartment>,
  ) {}

  async getTodayTimeSheet(username: string) {
    const data = await this.redis.get('timesheets');
    const timesheet = <ITimeSheet[]>JSON.parse(data || '[]');
    const users = await FileData.readUsers();
    const user = users.find((x) => x.name === username);
    const todayTimeSheet = timesheet.find(
      (x) => x.userid === user?.id && x.value,
    );
    return todayTimeSheet;
  }

  async getUserAttendanceSummay(username: string) {
    const date = moment().format('YYYY-MM');
    const dingdingAttendances = await FileData.readAttendances(date);
    const customAttendances = await FileData.readCustomAttendances(date);
    const holidays = await FileData.readHolidays(moment().year().toString());
    const attendances = dingdingAttendances.map(
      (ul: IUserAttendances, index: number) => {
        customAttendances[index].attendances.forEach((x: IAttendances[], i) => {
          if (x !== null) {
            ul.attendances[i] = x;
          }
        });
        return ul;
      },
    );
    const userAttendance = attendances.find((x) => x.name === username);
    const attendanceLog = {
      late: 0,
      notCommitReportCount: 0,
      tomorrowIsHoliday:
        holidays.find(
          (x) => x === moment().add(1, 'days').format('YYYY-MM-DD'),
        ) != null,
    };
    userAttendance.attendances.map((_attendance) => {
      _attendance.map((x) => {
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
    return users.find((x) => x.name === username);
  }

  async generateUserDepartment() {
    const users = await KcClient.kcAdminClient.users.find();
    let departmentids = [];
    for (const user of users) {
      if (['陶智', '胡秋成'].includes(user.username)) {
        departmentids = [3];
      } else if (['王中伟'].includes(user.username)) {
        departmentids = [5];
      } else if (['王祯鹏'].includes(user.username)) {
        departmentids = [4];
      } else if (['王志峰'].includes(user.username)) {
        departmentids = [1, 2, 3, 4, 5];
      } else if (
        ['代瓒', '谈娜', '吴美美', '张华尘', '何三星'].includes(user.username)
      ) {
        departmentids = [2];
      } else {
        departmentids = [1];
      }
      await this.departmentRepository.save({
        userid: user.id,
        departmentids: departmentids,
        createTime: now(),
      });

      user.attributes = {
        ...user.attributes,
        departmentids: departmentids.join(','),
      };

      await KcClient.kcAdminClient.users.update({ id: user.id }, user);
    }
  }

  async updateUserDepartment() {
    const users = await KcClient.kcAdminClient.users.find();
    let departmentids = [];
    for (const user of users) {
      departmentids = [1, 5];
      // if (['陶智', '胡秋成'].includes(user.username)) {
      //   departmentids = [2];
      // } else if (['王中伟'].includes(user.username)) {
      //   departmentids = [5];
      // } else if (['王祯鹏'].includes(user.username)) {
      //   departmentids = [4];
      // } else if (['王志峰'].includes(user.username)) {
      //   departmentids = [1, 2, 3, 4, 5];
      // } else if (
      //   ['代瓒', '谈娜', '吴美美', '张华尘', '何三星'].includes(user.username)
      // ) {
      //   departmentids = [1];
      // }
      // this.departmentRepository.create({
      //   userid: user.id,
      //   departmentids: departmentids,
      //   createTime: now(),
      // });
    }
  }

  async getUsers(departmentids?: string[]) {
    let users = await KcClient.kcAdminClient.users.find();
    if (departmentids) {
      users = users.filter(
        (x) =>
          intersect(departmentids, x.attributes['departmentids']).length > 0,
      );
    }
    return users;
  }
}
