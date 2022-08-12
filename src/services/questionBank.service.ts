import { QuestionBank } from '@entities/questionBank.entity';
import { QuestionContributor } from '@entities/questionContributor.entity';
import {
  ICreateQuestionBankBody,
  IQuestionListModel,
  IUpdateQuestionBankBody,
} from '@models/questionBank.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { now } from '@utils/utils';
import { Repository } from 'typeorm';
import { QuestionAnswerService } from './questionAnswer.service';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(QuestionBank)
    private readonly questionRepository: Repository<QuestionBank>,
    @InjectRepository(QuestionContributor)
    private readonly contributorRepository: Repository<QuestionContributor>,
    private readonly snswerService: QuestionAnswerService,
  ) {}

  async getQuestion(questionId: string) {
    return await this.questionRepository.findOneBy({
      id: questionId,
    });
  }

  async getQuestionList(userId: string, showAll: boolean) {
    const where = { enabled: true };
    if (showAll) {
      delete where.enabled;
    }

    const questionList = await this.questionRepository.find({
      where: where,
      order: { createTime: 'ASC' },
    });

    const list = [] as IQuestionListModel[];
    for (const question of questionList) {
      const questionAnswer = await this.snswerService.getUserLastQuestionAnswer(
        question.id,
        userId,
      );

      list.push({
        id: question.id,
        name: question.name,
        level: question.level,
        enabled: question.enabled,
        isPassed: questionAnswer?.isPassed,
        elapsedTime: questionAnswer?.elapsedTime,
        createTime: question.createTime,
      });
    }
    return list;
  }

  async updateQuestion(body: IUpdateQuestionBankBody) {
    const question = await this.questionRepository.findOneBy({
      id: body.id,
    });

    question.cases = body.cases;
    question.describe = body.describe;
    question.enabled = body.enabled;
    question.entryCodes = body.entryCodes;
    question.level = body.level;
    question.name = body.name;

    const data = await this.questionRepository.update(question.id, question);
    await this.contributorRepository.save({
      questionId: question.id,
      userId: body.userId,
      userName: body.userName,
      createTime: now(),
    });

    if (data.affected > 0) {
      return question;
    }
    return null;
  }

  async createQuestion(body: ICreateQuestionBankBody) {
    const data = await this.questionRepository.save({
      name: body.name,
      level: body.level,
      cases: body.cases,
      describe: body.describe,
      entryCodes: body.entryCodes,
      createTime: now(),
      status: false,
    });

    if (data.id) {
      await this.contributorRepository.save({
        questionId: data.id,
        userId: body.userId,
        userName: body.userName,
        createTime: now(),
      });
    }

    return data;
  }
}
