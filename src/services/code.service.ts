import { Language } from '@entities/language.entity';
import { IQuestionCase, QuestionBank } from '@entities/questionBank.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import spawnPromise from '@utils/spawnPromise';
import { Repository } from 'typeorm';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(QuestionBank)
    private readonly questionRepository: Repository<QuestionBank>,
  ) {}

  async getQuestion(questionId: string) {
    return await this.questionRepository.findOneBy({
      id: questionId,
    });
  }

  async getLanguage(languageId: number) {
    return await this.languageRepository.findOneBy({
      id: languageId,
    });
  }

  async getLanguages() {
    return await this.languageRepository.find();
  }

  async prepareCode(language: Language, code: string) {
    const command = `code="${code}"
      cat <<< "$code" > ${language.file}
      ${language.cmd}
    `;
    return command;
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
    language: Language,
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
    return await this.prepareCode(language, code);
  }

  async run(
    language: Language,
    codeCommand: string,
    timeout: number,
  ): Promise<any> {
    return await spawnPromise(
      'docker',
      [
        'run',
        '--rm',
        '-i',
        `--memory=${language.memory}m`,
        `--cpuset-cpus=${language.cpuset}`,
        language.iamge,
        '/bin/bash',
        '-c',
        codeCommand,
      ],
      { timeout: timeout },
    )
      .then((data) => {
        return { isSuccess: true, data: data };
      })
      .catch((error) => {
        return { isSuccess: false, data: error };
      });
  }
}
