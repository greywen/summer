import { IQuestionDto } from '@dtos/code';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Put,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ICreateQuestionBankBody,
  IUpdateQuestionBankBody,
} from '@models/questionBank.model';
import { QuestionBankService } from '@services/questionBank.service';
import { NestRes } from '@interfaces/nestbase';
import { QuestionAnswerService } from '@services/questionAnswer.service';

@UseGuards(AuthGuard('jwt'))
@Controller('question')
export class QuestionBankController {
  constructor(
    private readonly questionAnswerService: QuestionAnswerService,
    private readonly questionBankService: QuestionBankService,
  ) {}

  @Get('/list')
  async getQuestionList() {
    const data = await this.questionBankService.getQuestionList();
    return data.map((x) => {
      return {
        id: x.id,
        name: x.name,
        createTime: x.createTime,
        level: x.level,
      } as IQuestionDto;
    });
  }

  @Get('/:questionId')
  async getQuestion(@Param('questionId') questionId: string) {
    const data = await this.questionBankService.getQuestion(questionId);
    return {
      id: data.id,
      name: data.name,
      desribe: data.describe,
      entrys: data.entryCodes,
    } as IQuestionDto;
  }

  verifyQuestion(question: ICreateQuestionBankBody) {
    try {
      JSON.parse(JSON.stringify(question.cases));
      JSON.parse(JSON.stringify(question.entryCodes));
    } catch (error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/add')
  async createQuestion(
    @Body() body: ICreateQuestionBankBody,
    @Request() req: NestRes,
  ) {
    this.verifyQuestion(body);
    return await this.questionBankService.createQuestion(body);
  }

  @Put('update')
  async updateQuestion(
    @Body() body: IUpdateQuestionBankBody,
    @Request() req: NestRes,
  ) {
    this.verifyQuestion(body);
    return await this.questionBankService.updateQuestion(body);
  }
}
