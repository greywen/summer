import { Body, Controller, Get, Post } from '@nestjs/common';
import { InformService } from '@services/inform.service';

@Controller('inform')
export class InformController {
  constructor(private readonly informService: InformService) {}

  @Get('/getAll')
  async getInform() {
    return await this.informService.getInforms();
  }

  @Get('/getCur')
  async getCurInform() {
    return await this.informService.getCurInform();
  }

  @Post('/add')
  async addInform(@Body() body) {
    return await this.informService.addInform(body);
  }

  @Post('/del')
  async delInform(@Body() body) {
    return await this.informService.delInform(body);
  }

  @Post('/modify')
  async modifyInform(@Body() body) {
    return await this.informService.modifyInform(body);
  }
}
