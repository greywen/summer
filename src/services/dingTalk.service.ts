import DingTalkApi from '@apis/dingTalkApi';
import {
  ICreateReport,
  IReportSimpleDatalist,
  IReportTemplate,
  IUser,
} from '@interfaces/dingTalk';
import { Injectable } from '@nestjs/common';
import { unique } from '@utils/utils';
import config from '@config/config';

@Injectable()
export class DingTalkService {
  dingTalkApi: DingTalkApi;
  bossId: string;
  constructor() {
    this.dingTalkApi = new DingTalkApi();
    this.bossId = config.dingTalk.bossId;
  }

  /**
   * 获取所有部门Id
   */
  async getDepartmentIds() {
    const departments = await this.dingTalkApi.getDepartments();
    const departmentIds = departments.map((x) => x.dept_id);
    for (const d of departments) {
      const _departmentIds = await this.dingTalkApi.getChildrenDepartments(
        d.dept_id,
      );
      departmentIds.push(..._departmentIds);
    }
    return unique<number>(departmentIds);
  }

  // 获取所有用户Id
  async getUserIds(departmentIds) {
    const userIds = [];
    for (const id of departmentIds) {
      const user = await this.dingTalkApi.getDepartmentUserIds(id);
      userIds.push(...user);
    }
    return unique<string>(userIds);
  }

  // 获取用户详情
  async getUsersDetail(userIds: string[]) {
    const users: IUser[] = [];
    for (const id of userIds) {
      const user = await this.dingTalkApi.getUserDetail(id);
      users.push({
        id: user['userid'],
        name: user['name'],
        unionid: user['unionid'],
        dept_id_list: user['dept_id_list'],
        dept_name: '',
        phone: '',
        hired_date: user['hired_date'],
      });
    }
    return users;
  }

  // 获取所有用户
  async getUsers() {
    // 获取所有的部门
    const departmentIds = await this.getDepartmentIds();
    let userIds = await this.getUserIds(departmentIds);
    userIds = userIds.filter((x) => {
      if (x != this.bossId) return x;
    });
    const users = await this.getUsersDetail(userIds);
    return users;
  }

  // 获取所有用户名称
  async getUsersName(name: string) {
    const users = await this.getUsers();
    return users.find((x) => x.name === name);
  }

  async getAttendanceList(
    userIdList: number[],
    startTime: string,
    endTime: string,
  ) {
    return await this.dingTalkApi.getAttendanceList(
      userIdList,
      startTime,
      endTime,
    );
  }

  async getReports(
    startTime: string,
    endTime: string,
    cursor: number,
    userId?: string,
  ) {
    return await this.dingTalkApi.getReports(
      startTime,
      endTime,
      cursor,
      userId,
    );
  }

  async getAllReports(
    startTime: string,
    endTime: string,
    cursor: number,
    userId?: string,
  ) {
    const reports = <IReportSimpleDatalist[]>[];
    let report = {
      has_more: true,
      data_list: <IReportSimpleDatalist[]>[],
      next_cursor: 0,
    };
    while (report.has_more) {
      report = await this.dingTalkApi.getReports(
        startTime,
        endTime,
        report.next_cursor,
        userId,
      );
      reports.push(...report.data_list);
    }
    return reports;
  }

  async createReport(body: ICreateReport) {
    return await this.dingTalkApi.createUserReport(body);
  }

  async getReportTemplateByName(body: IReportTemplate) {
    return await this.dingTalkApi.getReportTemplateByName(body);
  }

  async getReportSimplelist(body: any) {
    return await this.dingTalkApi.getReportSimplelist(body);
  }
}
