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
    userId: string,
    languageId?: number,
  ) {
    const where = {
      questionId,
      languageId,
      userId,
    };

    if (!languageId) {
      delete where.languageId;
    }

    return await this.answerRepository.findOne({
      where: where,
      order: { createTime: 'DESC' },
    });
  }
}
