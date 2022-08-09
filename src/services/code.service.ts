import config from '@config/config';
import { ICodeRunResult, ICodeRunBody, IRunCaseResult } from '@dtos/code';
import { IQuestionCase, QuestionBank } from '@entities/questionBank.entity';
import { LanguageModel } from '@models/language.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { httpGet, httpPost } from '@utils/httpRequest';
import { matchCaseResult } from '@utils/utils';
import { Repository } from 'typeorm';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(QuestionBank)
    private readonly questionRepository: Repository<QuestionBank>,
  ) {}

  async getQuestion(questionId: string) {
    return await this.questionRepository.findOneBy({
      id: questionId,
    });
  }

  async getLanguage(languageId: number) {
    const languages = await this.getLanguages();
    return languages.find((x) => x.id == languageId);
  }

  async getLanguages() {
    return await httpGet<LanguageModel[]>(
      `${config.services.codeService}/languages`,
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
    const { code, questionId, languageId, once } = params;

    const question = await this.getQuestion(questionId);
    const language = await this.getLanguage(languageId);

    const result = [] as IRunCaseResult[];
    for (const testcase of question.cases) {
      const codeCommand = await this.prepareCodeCase(
        language,
        code,
        question.entry,
        testcase,
      );

      const _result = await this.run(languageId, codeCommand);
      result.push({
        ...testcase,
        ...this.extractCaseResult(_result.data),
        logs: _result.data,
      });

      if (once || !_result.isSuccess) {
        break;
      }
    }
    return result;
  }

  async run(languageId: number, code: string): Promise<ICodeRunResult> {
    return await httpPost<ICodeRunResult>(
      `${config.services.codeService}/run`,
      {
        body: JSON.stringify({
          languageId: languageId,
          code: code,
        }),
      },
    );
  }
}
