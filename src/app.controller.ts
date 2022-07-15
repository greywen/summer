import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './services';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get('checkHealth')
  async checkHealth(): Promise<string> {
    // await this.userService.generateUserDepartment();
    return this.appService.checkHealth();
  }
}
