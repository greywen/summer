import config from '@config/config';
import { ICodeRunResult, ICodeRunBody, IRunCaseResult } from '@dtos/code';
import { QuestionAnswer } from '@entities/questionAnswer.entity';
import { IQuestionCase } from '@entities/questionBank.entity';
import { LanguageModel } from '@models/language.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { httpGet, httpPost } from '@utils/httpRequest';
import { matchCaseResult, now } from '@utils/utils';
import { Repository } from 'typeorm';
import { QuestionBankService } from './questionBank.service';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(QuestionAnswer)
    private readonly answerRepository: Repository<QuestionAnswer>,
    private readonly questionBankService: QuestionBankService,
  ) {}

  async getLanguage(languageId: number) {
    const languages = await this.getLanguageList();
    return languages.find((x) => x.id == languageId);
  }

  async getLanguageList() {
    return await httpGet<LanguageModel[]>(
      `${config.services.languageService}/languages`,
    );
  }

  async prepareCodeCase(
    language: LanguageModel,
    code: string,
    entry: string,
    cases: IQuestionCase,
  ) {
    const testCaseCode = language.captureCode
      .replace('${entry}', entry)
      .replace('${input}', cases.input);
    code += testCaseCode;

    return code;
  }

  extractCaseResult(value: string) {
    value = value ?? '';
    return {
      elapsedTime: matchCaseResult('ElapsedTime', value),
      codeOutput: matchCaseResult('Output', value),
    };
  }

  async runCodeByCase(params: ICodeRunBody) {
    const { code, questionId, languageId, once, userId } = params;

    const question = await this.questionBankService.getQuestion(questionId);

    if (!question.enabled) {
      return { isSuccess: false, message: '题目暂时不能作答，请稍后再试' };
    }

    const language = await this.getLanguage(languageId);
    const entry = question.entryCodes.find((x) => x.languageId === languageId);
    const cases = question.cases.filter((x) => x.languageId === languageId);

    const result = [] as IRunCaseResult[];
    const recordResults = [];
    let isPassed = false,
      elapsedTime = 0;

    for (const testcase of cases) {
      const codeCommand = await this.prepareCodeCase(
        language,
        code,
        entry.function,
        testcase,
      );

      const _result = await this.run(languageId, codeCommand);

      result.push({
        ...testcase,
        ...this.extractCaseResult(_result.data),
        logs: _result.data,
      });

      recordResults.push({
        ...testcase,
        ...this.extractCaseResult(_result.data),
      });

      if (once || !_result.isSuccess) {
        break;
      }
    }
    if (!once) {
      const passedResult = result.filter((x) => {
        elapsedTime += parseFloat(x.elapsedTime);
        return (
          JSON.stringify(`${x.output}`.replace(/\s/g, '')) ===
          JSON.stringify(`${x.codeOutput}`.replace(/\s/g, ''))
        );
      });

      isPassed = passedResult.length === result.length;

      await this.answerRepository.save([
        {
          userId: userId,
          questionId: questionId,
          code: code,
          languageId: languageId,
          createTime: now(),
          result: JSON.stringify(recordResults),
          elapsedTime,
          isPassed,
        },
      ]);
    }

    return result;
  }

  async run(languageId: number, code: string): Promise<ICodeRunResult> {
    return await httpPost<ICodeRunResult>(
      `${config.services.languageService}/run`,
      {
        body: JSON.stringify({
          languageId: languageId,
          code: code,
        }),
      },
    );
  }
}
