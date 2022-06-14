import {
  IAttendanceLeaveResult,
  IAttendanceListResult,
  ICreateReport,
  IDepartmentIdResult,
  IDepartmentResult,
  IDingTalkDefaultBaseResult,
  IDingTalkTokenResponseResult,
  IDingTalkUserListIdResult,
  IDingTalkUserResult,
  IGetReportSimplelistParams,
  IGetReportSimplelistResult,
  IReportSimpleListResult,
  IReportTemplate,
  IReportTemplateResult,
  IUserAttendanceResult,
} from '@interfaces/dingTalk';
import * as moment from 'moment';
import fetch from 'node-fetch';
import config from '@config/config';

export default class DingTalkApi {
  private apiUrl = config.dingTalk.apiUrl;
  private v1ApiUrl = config.dingTalk.v1ApiUrl;
  private v2ApiUrl = config.dingTalk.v2ApiUrl;
  async getDingTalkAccessToken() {
    const { access_token, expires } = global['dingTalkToken'] || {
      access_token: null,
      expires: 0,
    };
    const currentUnix = moment().unix();
    if (!access_token || expires < currentUnix) {
      const res: IDingTalkTokenResponseResult = await fetch(
        `${config.dingTalk.apiUrl}/gettoken?appkey=${config.dingTalk.apikey}&appsecret=${config.dingTalk.apisecret}`,
      ).then((res) => res.json());
      res.expires = moment()
        .add(config.dingTalk.tokenExpires, 'minutes')
        .unix();
      global['dingTalkToken'] = res;
      return res.access_token;
    }
    return access_token;
  }

  /**
   * 获取部门列表
   */
  async getDepartments() {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(
      `${this.v2ApiUrl}/department/listsub?access_token=${token}`,
      { method: 'POST' },
    ).then((res): Promise<IDepartmentResult> => res.json());
    return res?.result;
  }

  /**
   * 获取子部门ID列表
   * dept_id 父部门ID 根部门传1
   */
  async getChildrenDepartments(dept_id: string) {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(
      `${this.v2ApiUrl}/department/listsubid?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify({
          dept_id: dept_id,
        }),
      },
    ).then((res): Promise<IDepartmentIdResult> => res.json());
    return res?.result?.dept_id_list;
  }

  /**
   * 获取用户详情
   * @param userId
   */
  async getUserDetail(userId: string) {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(`${this.v2ApiUrl}/user/get?access_token=${token}`, {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
      }),
    }).then((res): Promise<IDingTalkUserResult> => res.json());
    return res.result;
  }

  /**
   * 获取部门用户userid列表
   * @param dept_id
   */
  async getDepartmentUserIds(dept_id: number) {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(
      `${this.v1ApiUrl}/user/listid?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify({
          dept_id,
        }),
      },
    ).then((res): Promise<IDingTalkUserListIdResult> => res.json());
    return res.result?.userid_list;
  }

  /**
   * 获取打卡结果
   * @param userIdList
   * @param startTime
   * @param endTime
   */
  async getAttendanceList(
    userIdList: number[],
    startTime: string,
    endTime: string,
  ) {
    const token = await this.getDingTalkAccessToken();
    const bodyData = {
      workDateFrom: startTime,
      offset: 0,
      userIdList: userIdList,
      limit: 50,
      isI18n: false,
      workDateTo: endTime,
    };
    const res = await fetch(
      `${this.apiUrl}/attendance/list?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(bodyData),
      },
    ).then((res): Promise<IAttendanceListResult> => res.json());
    return res.recordresult;
  }

  /**
   * 获取用户发送日志的概要信息
   */
  async getReports(
    startTime: string,
    endTime: string,
    cursor: number,
    userId?: string,
  ) {
    const token = await this.getDingTalkAccessToken();
    const body = {
      cursor: cursor,
      start_time: new Date(startTime).getTime(),
      template_name: ['TIMESHEET', '日报'],
      size: 20,
      end_time: new Date(endTime).getTime(),
    };

    if (userId) {
      body['userid'] = userId;
    }

    const response = await fetch(
      `${this.v1ApiUrl}/report/simplelist?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    ).then((res): Promise<IReportSimpleListResult> => res.json());
    return response.result;
  }

  /**
   * 获取用户考勤数据
   */
  async getUserAttendance(userId: string, workdate: string) {
    const token = await this.getDingTalkAccessToken();
    const bodyData = {
      work_date: workdate,
      userid: userId,
    };
    const res = await fetch(
      `${this.v1ApiUrl}/attendance/getupdatedata?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(bodyData),
      },
    ).then((res): Promise<IUserAttendanceResult> => res.json());
    return res.result;
  }

  /**
   * 获取报表假期数据
   */
  async getUserAttendanceLeaveTimeByNames(
    userid: string,
    leave_names: string,
    from_date: string,
    to_date: string,
  ) {
    const token = await this.getDingTalkAccessToken();
    const bodyData = {
      userid: userid,
      leave_names: leave_names,
      from_date: from_date,
      to_date: to_date,
    };
    const punchIn = await fetch(
      `${this.v1ApiUrl}/attendance/getleavetimebynames?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(bodyData),
      },
    ).then((res): Promise<IAttendanceLeaveResult> => res.json());
    return punchIn.result;
  }

  /**
   * 创建日志
   */
  async createUserReport(
    bodyData: ICreateReport,
  ): Promise<IDingTalkDefaultBaseResult> {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(
      `${this.apiUrl}/topapi/report/create?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify({ create_report_param: bodyData }),
      },
    ).then((res): Promise<IDingTalkDefaultBaseResult> => res.json());
    return res;
  }

  /**
   * 获取模板详情
   */
  async getReportTemplateByName(
    bodyData: IReportTemplate,
  ): Promise<IReportTemplateResult> {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(
      `${this.apiUrl}/topapi/report/template/getbyname?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(bodyData),
      },
    ).then((res): Promise<IReportTemplateResult> => res.json());
    return res;
  }

  /**
   * 获取用户发送日志的概要信息
   */
  async getReportSimplelist(
    bodyData: IGetReportSimplelistParams,
  ): Promise<IGetReportSimplelistResult> {
    const token = await this.getDingTalkAccessToken();
    const res = await fetch(
      `${this.apiUrl}/topapi/report/simplelist?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(bodyData),
      },
    ).then((res): Promise<IGetReportSimplelistResult> => res.json());
    return res;
  }
}
