import config from '@config/config';
import { ICodeResult } from '@dtos/code';
import { IQuestionCase, QuestionBank } from '@entities/questionBank.entity';
import { LanguageModel } from '@models/language.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { httpGet, httpPost } from '@utils/httpRequest';
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

  prepareCodeCommands(language: LanguageModel, code: string) {
    const commands = `${language.beforInjectionCodeCmd}
      code="${code.replace(/"/g, '\\"')}"
      cat <<< "$code" > ${language.fileName}
      ${language.afterInjectionCodeCmd}
    `;
    return commands;
  }

  async prepareTestCaseCode(
    entry: string,
    cases: IQuestionCase,
    captureCode: string,
  ) {
    const testCaseCode = captureCode
      .replace('${entry}', entry)
      .replace('${case}', cases.case);
    return testCaseCode;
  }

  async prepareRunCommand(
    language: LanguageModel,
    code: string,
    entry: string,
    cases: IQuestionCase,
  ) {
    const testCaseCode = await this.prepareTestCaseCode(
      entry,
      cases,
      language.captureCode,
    );
    code += testCaseCode;
    return await this.prepareCodeCommands(language, code);
  }

  async run(languageId: number, code: string): Promise<any> {
    return await httpPost<ICodeResult>(`${config.services.codeService}/run`, {
      body: JSON.stringify({
        languageId: languageId,
        code: code,
      }),
    });
  }
}
