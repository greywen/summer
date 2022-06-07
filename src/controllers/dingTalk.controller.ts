import FileData from '@core/files.data';
import { IUserCreateDto, IUserUpdateDto } from '@dtos/dingTlak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DingTalkService } from '@services/dingTalk.service';
import * as moment from 'moment';

// @UseGuards(AuthGuard('jwt'))
@Controller('dingtalk')
export class DingTalkController {
  constructor(private readonly dingTalkService: DingTalkService) {}

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
}
