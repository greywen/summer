import { Column, Entity } from 'typeorm';

@Entity({ name: 'question_answer' })
export class QuestionAnswer {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('varchar', { length: 50, nullable: true })
  questionId: string;
  @Column('int2', { nullable: true })
  languageId: number;
  @Column('varchar', { length: 50, nullable: true })
  userId: string;
  @Column('text', { nullable: true })
  code: string;
  @Column('text', { nullable: true })
  result: string;
  @Column('timestamp')
  createTime: string;
}
