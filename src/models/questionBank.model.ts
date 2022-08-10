import { IEntryCode, IQuestionCase } from '@entities/questionBank.entity';

export interface ICreateQuestionBankBody {
  name: string;
  level?: number;
  describe?: string;
  entryCodes?: IEntryCode[];
  cases?: IQuestionCase[];
}

export interface IUpdateQuestionBankBody extends ICreateQuestionBankBody {
  id: string;
}
