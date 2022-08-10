import { ICodeRunBody } from '@dtos/code';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LanguageService } from '@services/language.service';
import recorder from '@utils/recorder';
import { sleep } from '@utils/utils';
import { v4 as uuid } from 'uuid';
import { ICodeLanguageDto } from '@dtos/code';
import { NestRes } from '@interfaces/nestbase';
const MAX_WAITING_TIME = 360;

@UseGuards(AuthGuard('jwt'))
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}
  @Post('run/case')
  async runByCase(
    @Body() body: ICodeRunBody,
    @Request() req: NestRes,
  ): Promise<any> {
    const id = uuid();
    let waitTime = 0;
    let result = null;
    body.userId = req.user.userId;

    recorder.add({
      id: id,
      fn: async () => await this.runByCaseImplement(body),
    });

    while (!result) {
      await sleep(0.2);
      result = recorder.get(id);

      waitTime++;
      if (waitTime > MAX_WAITING_TIME) {
        result = { isSuccess: false, message: '运行超时' };
      }
    }

    return result;
  }

  async runByCaseImplement(body: ICodeRunBody) {
    const { code, questionId, languageId } = body;
    if (!languageId || !questionId || !code) {
      return '';
    }

    return await this.languageService.runCodeByCase(body);
  }

  @Post('run')
  async run(@Body() body: ICodeRunBody): Promise<any> {
    const id = uuid();
    let waitTime = 0;
    let result = null;

    recorder.add({
      id: id,
      fn: async () => await this.runImplement(body),
    });

    while (!result) {
      await sleep(0.2);
      result = recorder.get(id);

      waitTime++;
      if (waitTime > MAX_WAITING_TIME) {
        result = { isSuccess: false, data: '执行超时.' };
      }
    }

    return result;
  }

  async runImplement(body: ICodeRunBody) {
    const { code, languageId } = body;
    return await this.languageService.run(languageId, code);
  }

  @Get('languages')
  async getLanguages() {
    const data = await this.languageService.getLanguageList();
    return data.map((x) => {
      return {
        id: x.id,
        name: x.name,
        initialCode: x.initialCode,
        version: x.version,
      } as ICodeLanguageDto;
    });
  }
}
