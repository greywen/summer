import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis'
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceController, AuthController, DingTalkController, TimeSheetController, UserController } from './controllers';
import { jwtModuleOptions, redisModuleOptions } from './modules';
import { TimeSheetSocket } from './sockets';
import { DingTalkSchedule, TimeSheetSchedule } from './schedules';
import { AttendanceService, AuthService, DingTalkService, ReportService, UserService } from './services';
import { JwtStrategy, WsGuard } from './strategys';

@Module({
  imports: [
    PassportModule,
    JwtModule.register(jwtModuleOptions),
    RedisModule.register(redisModuleOptions),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    AttendanceController,
    DingTalkController,
    AuthController,
    TimeSheetController,
    UserController
  ],
  providers: [
    WsGuard,
    JwtStrategy,
    AppService, AttendanceService, DingTalkService, ReportService, AuthService, UserService,
    TimeSheetSocket,
    DingTalkSchedule, TimeSheetSchedule
  ],
  exports: [AuthService]
})
export class AppModule { }

