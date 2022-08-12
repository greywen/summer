import { Column, Entity } from 'typeorm';

@Entity({ name: 'question_bank' })
export class QuestionBank {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('varchar', { length: 100 })
  name: string; // 题目名称
  @Column('smallint', { nullable: true })
  level: number; // 难度级别
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  entryCodes: IEntryCode[]; // 默认填充代码
  @Column('text', { nullable: true })
  describe?: string; // 题目描述
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  cases?: IQuestionCase[]; // 测试cases
  @Column('boolean', { nullable: true })
  enabled: boolean; // 是否展示
  @Column('timestamp')
  createTime: string;
}

export class IQuestionCase {
  languageId: number;
  comments: string;
  input: any;
  output: any;
}

export class IEntryCode {
  languageId: number;
  function: string; // 入口方法
  code: string;
}
