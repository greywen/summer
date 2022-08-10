import { Controller, UseGuards, Get, Param, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NestRes } from '@interfaces/nestbase';
import { QuestionAnswerService } from '@services/questionAnswer.service';

@UseGuards(AuthGuard('jwt'))
@Controller('answer')
export class QuestionAnswerController {
  constructor(private readonly questionAnswerService: QuestionAnswerService) {}

  @Get('/last/:questionId/:languageId')
  async getUserLastQuestionAnswer(
    @Param('questionId') questionId: string,
    @Param('languageId') languageId: number,
    @Request() req: NestRes,
  ) {
    const data = await this.questionAnswerService.getUserLastQuestionAnswer(
      questionId,
      languageId,
      req.user.userId,
    );

    if (data.length > 0) {
      return data[0].code;
    }
    return null;
  }
}
