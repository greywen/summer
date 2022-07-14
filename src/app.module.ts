import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AttendanceController,
  AuthController,
  DingTalkController,
  TimeSheetController,
  UserController,
  InformController,
} from './controllers';
import {
  jwtModuleOptions,
  redisModuleOptions,
  typeOrmOptions,
} from './modules';
import { TimeSheetSocket } from './sockets';
import { TimeSheetSchedule, KeyCloakSchedule } from './schedules';
import {
  AttendanceService,
  AuthService,
  DingTalkService,
  ReportService,
  UserService,
  InformService,
  TimeSheetService,
  UserDepartmentService,
} from './services';
import { JwtStrategy, WsGuard } from './strategys';
import {
  DataPermission,
  DataDepartment,
  UserTimesheet,
  UserDepartment,
} from './entities';

@Module({
  imports: [
    PassportModule,
    JwtModule.register(jwtModuleOptions),
    RedisModule.forRoot(redisModuleOptions),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmOptions),
    TypeOrmModule.forFeature([
      DataPermission,
      DataDepartment,
      UserTimesheet,
      UserDepartment,
    ]),
  ],
  controllers: [
    AppController,
    AttendanceController,
    DingTalkController,
    AuthController,
    TimeSheetController,
    UserController,
    InformController,
  ],
  providers: [
    WsGuard,
    JwtStrategy,
    AppService,
    AttendanceService,
    DingTalkService,
    ReportService,
    AuthService,
    UserService,
    InformService,
    TimeSheetService,
    UserDepartmentService,
    TimeSheetSocket,
    TimeSheetSchedule,
    KeyCloakSchedule,
  ],
  exports: [AuthService],
})
export class AppModule {}
