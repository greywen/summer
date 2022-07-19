import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get('checkHealth')
  async checkHealth(): Promise<string> {
    return 'Healthy!';
  }
}
