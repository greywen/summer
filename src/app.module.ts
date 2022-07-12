import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
import { jwtModuleOptions, redisModuleOptions } from './modules';
import { TimeSheetSocket } from './sockets';
import { TimeSheetSchedule } from './schedules';
import {
  AttendanceService,
  AuthService,
  DingTalkService,
  ReportService,
  UserService,
  InformService,
} from './services';
import { JwtStrategy, WsGuard } from './strategys';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import config from '@config/config';
import {
  DataPermission,
  DataDepartment,
  UserTimesheet,
  UserDepartment,
  DepartmentPermission,
} from '@entities/index';

@Module({
  imports: [
    PassportModule,
    JwtModule.register(jwtModuleOptions),
    RedisModule.forRoot(redisModuleOptions),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...config.postgresql,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
    }),
    TypeOrmModule.forFeature([
      DataPermission,
      DataDepartment,
      UserTimesheet,
      UserDepartment,
      DepartmentPermission,
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
    TimeSheetSocket,
    TimeSheetSchedule,
  ],
  exports: [AuthService],
})
export class AppModule {}
