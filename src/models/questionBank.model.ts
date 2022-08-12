import { IEntryCode, IQuestionCase } from '@entities/questionBank.entity';

export interface ICreateQuestionBankBody {
  userId?: string;
  userName?: string;
  name: string;
  level?: number;
  describe?: string;
  entryCodes?: IEntryCode[];
  cases?: IQuestionCase[];
}

export interface IUpdateQuestionBankBody extends ICreateQuestionBankBody {
  id: string;
  enabled: boolean;
}

export interface IQuestionListModel {
  id: string;
  name: string;
  createTime: string;
  level: number;
  describe?: string;
  isPassed: boolean;
  elapsedTime: number;
  cases?: IQuestionCase[];
  entryCodes?: IEntryCode[];
  enabled: boolean;
}
