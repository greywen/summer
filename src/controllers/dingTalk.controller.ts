import config from '@config/config';
import FileData from '@core/files.data';
import {
  ICreateReportDto,
  IGetReportTemplateByNameDto,
  IUserCreateDto,
  IUserUpdateDto,
} from '@dtos/dingTlak';
import { ICreateReport } from '@interfaces/dingTalk';
import { NestRes } from '@interfaces/nestbase';
import { ITimeSheet } from '@interfaces/timesheet';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DingTalkService } from '@services/dingTalk.service';
import * as moment from 'moment';
@UseGuards(AuthGuard('jwt'))
@Controller('dingtalk')
export class DingTalkController {
  constructor(
    private readonly dingTalkService: DingTalkService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get('/departments')
  async getDepartments() {
    return await FileData.readDepartments();
  }

  @Get('/user')
  async getUsers() {
    return await this.dingTalkService.getUsers();
  }

  @Post('/user')
  async createUser(@Body() createDto: IUserCreateDto) {
    const { name, dept_name, groupid } = createDto;
    let userDetail = await this.dingTalkService.getUsersName(name);
    if (!userDetail) {
      return '没有找到该用户的信息.';
    }

    userDetail = { ...userDetail, groupid: groupid || null };
    userDetail.dept_name = dept_name;
    const users = await FileData.readUsers();
    if (users.find((x) => x.id === userDetail.id)) {
      return '已存在该用户.';
    }
    let lastIndex = users.length;
    users.forEach((x, index) => {
      if (x.dept_name === dept_name) lastIndex = index;
    });

    users.splice(lastIndex + 1, 0, userDetail);
    await FileData.writeUsers(JSON.stringify(users));
    const fileName = moment().format('YYYY-MM');
    const customAttendances = await FileData.readCustomAttendances(fileName);
    const userAttendances = await FileData.readAttendances(fileName);
    userAttendances.splice(lastIndex + 1, 0, {
      id: userDetail.id,
      name: userDetail.name,
      dept_name: userDetail.dept_name,
      attendances: Array.from(new Array(moment().daysInMonth()), () => []),
    });
    await FileData.writeAttendances(fileName, userAttendances);
    customAttendances.splice(lastIndex + 1, 0, {
      id: userDetail.id,
      name: userDetail.name,
      dept_name: userDetail.dept_name,
      attendances: Array.from(new Array(moment().daysInMonth()), () => null),
    });
    const result = await FileData.writeCustomAttendances(
      fileName,
      customAttendances,
    );
    return result;
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId: string) {
    const users = await FileData.readUsers();
    if (userId) {
      return users.find((x) => x.id === userId);
    }
    return users;
  }

  @Delete('/user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const users = await FileData.readUsers();
    const index = users.findIndex((x) => x.id === userId);

    if (index === -1) {
      return '没有找到该用户的信息.';
    }

    users.splice(index, 1);
    await FileData.writeUsers(JSON.stringify(users));
    const fileName = moment().format('YYYY-MM');
    const customAttendances = await FileData.readCustomAttendances(fileName);
    const userAttendances = await FileData.readAttendances(fileName);
    userAttendances.splice(index, 1);
    await FileData.writeAttendances(fileName, userAttendances);
    customAttendances.splice(index, 1);
    const result = await FileData.writeCustomAttendances(
      fileName,
      customAttendances,
    );
    return result;
  }

  @Put('/user')
  async updateUser(@Body() updateDto: IUserUpdateDto) {
    const { name, id, phone, dept_name, english_name, groupid } = updateDto;
    let users = await FileData.readUsers();
    if (id) {
      users = users.map((user) => {
        if (user.id === id) {
          user.name = name || user.name;
          user.phone = phone || null;
          user.dept_name = dept_name || null;
          user.english_name = english_name || null;
          user.groupid = groupid || null;
        }
        return user;
      });
    }

    const result = await FileData.writeUsers(JSON.stringify(users));
    return result;
  }

  @Post('/createPeport')
  async createReport(@Body() Body: ICreateReportDto, @Request() req: NestRes) {
    const templeDetail = await this.dingTalkService.getReportTemplateByName({
      template_name: 'TIMESHEET',
      userid: req.user.dingTalkUserId,
    });
    const contents = [];
    contents[0] = {
      content_type: 'markdown',
      sort: '4',
      type: '1',
      content: '-',
      key: '任务简述',
    };
    contents[3] = {
      content_type: 'markdown',
      sort: '3',
      type: '1',
      content: '-',
      key: 'Related Info',
    };

    for (const key in Body) {
      if (key === 'taskDescription' && Body.taskDescription !== '') {
        contents[0] = {
          content_type: 'markdown',
          sort: '4',
          type: '1',
          content: Body.taskDescription,
          key: '任务简述',
        };
      }
      if (key === 'taskStatus') {
        contents[1] = {
          content_type: 'markdown',
          sort: '0',
          type: '1',
          content: Body.taskStatus,
          key: '任务状态',
        };
      }
      if (key === 'taketime') {
        contents[2] = {
          content_type: 'markdown',
          sort: '1',
          type: '2',
          content: `${Body.taketime}`,
          key: '花费时间',
        };
      }
    }
    const params: ICreateReport = {
      contents: contents,
      template_id: templeDetail.result.id,
      to_chat: false,
      to_cids: [config.dingTalk.conversationId],
      dd_from: 'fenglin',
      userid: req.user.dingTalkUserId,
    };
    templeDetail.result?.default_receivers &&
      (params.to_userids = templeDetail.result.default_receivers.map((item) => {
        return item.userid;
      }));

    const result = await this.dingTalkService.createReport(params);
    if (result.errcode === 0) {
      return true;
    }
    return false;
  }

  @Get('/getReportTemplateByName')
  async getReportTemplateByName(@Request() req: NestRes) {
    const { dingTalkUserId } = req.user;
    const _timesheet = await this.redis.get('timesheets');
    const datas = <ITimeSheet[]>JSON.parse(_timesheet || '[]');
    const userTimeSheet = datas.find((x) => x.userid === dingTalkUserId);

    const result = await this.dingTalkService.getReportTemplateByName({
      template_name: 'TIMESHEET',
      userid: dingTalkUserId,
    });
    result.result.value = userTimeSheet?.value;
    return result.result;
  }

  @Get('/getReportFinished')
  async getSimplelist(@Request() req: NestRes) {
    const result = await this.dingTalkService.getReportSimplelist({
      start_time: moment().startOf('day').format('x'),
      end_time: moment().endOf('day').format('x'),
      template_name: 'TIMESHEET',
      userid: req.user.dingTalkUserId,
      cursor: 0,
      size: 1,
    });
    if (result?.result?.data_list.length > 0) {
      return true;
    }
    return false;
  }
}
