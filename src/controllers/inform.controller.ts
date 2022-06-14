import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InformService } from '@services/inform.service';

@Controller('inform')
export class InformController {
  constructor(private readonly informService: InformService) {}

  @Get('/getAll')
  async getInform() {
    return await this.informService.getInforms();
  }

  @Get('/getCurrent')
  async getCurInform() {
    return await this.informService.getCurrentInform();
  }

  @Post('/add')
  async addInform(@Body() body) {
    return await this.informService.addInform(body);
  }

  @Delete('/delete/:id')
  async delInform(@Param('id') id: string) {
    return await this.informService.deleteInform(id);
  }

  @Put('/modify')
  async modifyInform(@Body() body) {
    return await this.informService.modifyInform(body);
  }
}
