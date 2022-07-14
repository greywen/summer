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
    const _month = moment(month).format('YYYY-MM');
    const dingUserId = req.user.dingUserId;
    const dingdingAttendances = await FileData.readAttendances(_month);
    const customAttendances = await FileData.readCustomAttendances(_month);
    const dAttendances = dingdingAttendances.find((x) => x.id === dingUserId);
    const cAttendances = customAttendances.find((x) => x.id === dingUserId);
    const attendances = dAttendances.attendances.map((x, index) => {
      const value = cAttendances.attendances[index];
      if (value !== null) x = value;
      return x;
    });
    return attendances;
  }

  // @Put('user')
  // async updateUser() {}
  // @Get('users')
  // async getUsers() {

  // }
}
