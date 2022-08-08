import { ICodeRunBody, IQuestionDto } from '@dtos/code';
import { Controller, UseGuards, Post, Body, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CodeService } from '@services/code.service';
import recorder from '@utils/recorder';
import { sleep } from '@utils/utils';
import { v4 as uuid } from 'uuid';
import { ICodeLanguageDto } from '@dtos/code';
const MAX_WAITING_TIME = 360;

@UseGuards(AuthGuard('jwt'))
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}
  @Post('run/case')
  async runByCase(@Body() body: ICodeRunBody): Promise<any> {
    const id = uuid();
    let waitTime = 0;
    let result = null;

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
    const { code, questionId, languageId, once } = body;

    const question = await this.codeService.getQuestion(questionId);
    const language = await this.codeService.getLanguage(languageId);
    const result = [];

    for (const testcase of question.cases) {
      const codeCommand = await this.codeService.prepareRunCommand(
        language,
        code,
        question.entry,
        testcase,
      );

      const _result = await this.codeService.run(
        language,
        codeCommand,
        language.timeout * 1000,
      );
      result.push(_result);

      if (once || !_result.isSuccess) {
        break;
      }
    }

    return result;
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
    const language = await this.codeService.getLanguage(languageId);
    const codeCommand = await this.codeService.prepareCode(language, code);
    return await this.codeService.run(
      language,
      codeCommand,
      language.timeout * 1000,
    );
  }

  @Get('languages')
  async getLanguages() {
    const data = await this.codeService.getLanguages();
    return data.map((x) => {
      return {
        id: x.id,
        name: x.name,
        initialCode: x.initialCode,
        version: x.version,
      } as ICodeLanguageDto;
    });
  }

  @Get('question/:questionId')
  async getQuestion(@Param('questionId') questionId: string) {
    const data = await this.codeService.getQuestion(questionId);
    return {
      id: data.id,
      name: data.name,
      desribe: data.describe,
      code: data.code,
    } as IQuestionDto;
  }
}
