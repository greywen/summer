import { Column, Entity } from 'typeorm';

@Entity({ name: 'question_bank' })
export class QuestionBank {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('varchar', { length: 100 })
  name: string; // 题目名称
  @Column('varchar', { length: 50 })
  entry: string; // 入口方法
  @Column('text')
  code: string; // 默认填充代码
  @Column('text')
  describe?: string; // 题目描述
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  cases?: IQuestionCase[]; // 测试cases
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  contributor?: string[]; // 贡献者 可以多个
  @Column('date')
  createTime: string;
}

export class IQuestionCase {
  case: any;
  assert: any;
}
