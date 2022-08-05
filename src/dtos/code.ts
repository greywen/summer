export interface ICodeRunBody {
  once?: boolean;
  code: string;
  questionId: string;
  languageId: number;
}

export interface ICodeLanguageDto {
  id: number;
  name: string;
  initialCode: string;
  version: string;
}

export interface IQuestionDto {
  id: string;
  name: string;
  desribe: string;
  code: string;
}
