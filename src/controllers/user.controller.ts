import { NestRes } from '@interfaces/nestbase';
import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@services/user.service';
import FileData from '@core/files.data';
import * as moment from 'moment';
import { IUserMemberDto } from '@dtos/user';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('members')
  async getUserMembers(@Request() req: NestRes): Promise<IUserMemberDto[]> {
    const users = await this.userService.getUserMember(req.user.departmentIds);
    return users.map((x) => {
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
}
