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

export interface ICodeRunResult {
  isSuccess: boolean;
  data: any;
}

export interface IRunCaseResult {
  comments: string;
  input: string;
  output: string;
  codeOutput?: string;
  elapsedTime?: string;
  logs?: string;
}
