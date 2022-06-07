import { NestRes } from '@interfaces/nestbase';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@services/user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('today')
  async getTodayInfo(@Request() req: NestRes) {
    return {
      timesheet: await this.userService.getTodayTimeSheet(req.user.username),
      attendance: await this.userService.getUserAttendanceSummay(
        req.user.username,
      ),
    };
  }
}
