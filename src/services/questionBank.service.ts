import { QuestionBank } from '@entities/questionBank.entity';
import {
  ICreateQuestionBankBody,
  IUpdateQuestionBankBody,
} from '@models/questionBank.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(QuestionBank)
    private readonly questionRepository: Repository<QuestionBank>,
  ) {}

  async getQuestion(questionId: string) {
    return await this.questionRepository.findOneBy({
      id: questionId,
    });
  }

  async getQuestionList() {
    return await this.questionRepository.find();
  }

  async updateQuestion(body: IUpdateQuestionBankBody) {
    const question = await this.questionRepository.findOneBy({
      id: body.id,
    });
    return await this.questionRepository.update(question.id, question);
  }

  async createQuestion(body: ICreateQuestionBankBody) {
    const data = await this.questionRepository.save([
      {
        name: body.name,
        level: body.level,
        cases: body.cases,
        describe: body.describe,
        entryCodes: body.entryCodes,
      },
    ]);
    return data;
  }
}
