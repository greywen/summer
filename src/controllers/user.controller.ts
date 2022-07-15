import { NestRes } from '@interfaces/nestbase';
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@services/user.service';
import FileData from '@core/files.data';
import * as moment from 'moment';
import { UserDepartmentService } from '@services/department.service';
import { IUserMemberDto } from '@dtos/user';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userDepartmentService: UserDepartmentService,
  ) {}
  @Get('today')
  async getTodayInfo(@Request() req: NestRes) {
    return {
      timesheet: await this.userService.getTodayTimeSheet(req.user.username),
      attendance: await this.userService.getUserAttendanceSummay(
        req.user.username,
      ),
    };
  }

  @Get('members')
  async getUserMembers(@Request() req: NestRes): Promise<IUserMemberDto[]> {
    const departmentMembers =
      await this.userDepartmentService.getDepartmentMembers(
        req.user.departmentIds,
      );
    return departmentMembers.map((x) => {
      return <IUserMemberDto>{
        username: x.username,
        avatar: x.attributes.avatar && x.attributes.avatar[0],
      };
    });
  }

  @Get('attendance/:month')
  async getUserAttendance(
    @Param('month') month: string,
    @Request() req: NestRes,
  ) {
    if (
      moment().diff(moment(month), 'months') === 1 ||
      moment().format('YYYY-MM') === moment(month).format('YYYY-MM')
    ) {
      const _month = moment(month).format('YYYY-MM');
      const dingUserId = req.user.dingUserId;
      const dingdingAttendances = await FileData.readAttendances(_month);
      const customAttendances = await FileData.readCustomAttendances(_month);
      const dAttendances = dingdingAttendances.find((x) => x.id === dingUserId);
      const cAttendances = customAttendances.find((x) => x.id === dingUserId);
      const attendances = dAttendances?.attendances.map((x, index) => {
        const value = cAttendances.attendances[index];
        if (value !== null) x = value;
        return x;
      });
      return attendances || [];
    }
    return [];
  }

  @Put('resource')
  async updateUser() {
    const users = await this.userService.getUsers();
    for (const user of users) {
      let resourceIds = '';
      if (user.attributes['departmentids'].includes('1')) {
        resourceIds = '1,2';
      } else if (
        user.attributes['departmentids'].includes('2') ||
        user.attributes['departmentids'].includes('3')
      ) {
        resourceIds = '1';
      } else if (
        user.attributes['departmentids'].includes('4') ||
        user.attributes['departmentids'].includes('5')
      ) {
        resourceIds = '1,3';
      } else {
        resourceIds = '1,2,3';
      }
      // await this.userService.updateUserResource(user.id, resourceIds);
    }
  }
  // @Get('users')
  // async getUsers() {

  // }
}
