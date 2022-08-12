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
import { Resources } from '@constants/resources';

@UseGuards(AuthGuard('jwt'))
@Controller('question')
export class QuestionBankController {
  constructor(
    private readonly questionAnswerService: QuestionAnswerService,
    private readonly questionBankService: QuestionBankService,
  ) {}

  @Get('/list')
  async getQuestionList(@Request() req: NestRes) {
    const authorized = req.user.resources.includes(Resources.updateQuestion);
    return await this.questionBankService.getQuestionList(
      req.user.userId,
      authorized,
    );
  }

  @Get('/:questionId')
  async getQuestion(@Param('questionId') questionId: string) {
    return await this.questionBankService.getQuestion(questionId);
  }

  verifyQuestion(question: ICreateQuestionBankBody) {
    if (!question.name) {
      throw new HttpException('题目名称不能为空', HttpStatus.BAD_REQUEST);
    }
    try {
      JSON.parse(JSON.stringify(question.cases));
      JSON.parse(JSON.stringify(question.entryCodes));
    } catch (error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createQuestion(
    @Body() body: ICreateQuestionBankBody,
    @Request() req: NestRes,
  ) {
    this.verifyQuestion(body);
    body.userId = req.user.userId;
    body.userName = req.user.username;
    return await this.questionBankService.createQuestion(body);
  }

  @Put()
  async updateQuestion(
    @Body() body: IUpdateQuestionBankBody,
    @Request() req: NestRes,
  ) {
    this.verifyQuestion(body);
    body.userId = req.user.userId;
    body.userName = req.user.username;
    return await this.questionBankService.updateQuestion(body);
  }
}
