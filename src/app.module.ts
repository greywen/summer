import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
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
} from './services';
import { JwtStrategy, WsGuard } from './strategys';
import { DataResource, DataDepartment, UserTimesheet } from './entities';

@Module({
  imports: [
    PassportModule,
    JwtModule.register(jwtModuleOptions),
    RedisModule.forRoot(redisModuleOptions),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmOptions),
    TypeOrmModule.forFeature([DataResource, DataDepartment, UserTimesheet]),
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
    AttendanceService,
    DingTalkService,
    ReportService,
    AuthService,
    UserService,
    InformService,
    TimeSheetService,
    TimeSheetSocket,
    TimeSheetSchedule,
    KeyCloakSchedule,
  ],
  exports: [AuthService],
})
export class AppModule {}
