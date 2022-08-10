import { QuestionAnswer } from '@entities/questionAnswer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionAnswerService {
  constructor(
    @InjectRepository(QuestionAnswer)
    private readonly answerRepository: Repository<QuestionAnswer>,
  ) {}
  async getUserLastQuestionAnswer(
    questionId: string,
    languageId: number,
    userId: string,
  ) {
    return await this.answerRepository.find({
      where: {
        questionId: questionId,
        languageId: languageId,
        userId: userId,
      },
      order: { createTime: 'DESC' },
    });
  }
}
