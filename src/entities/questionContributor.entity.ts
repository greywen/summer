import { Column, Entity } from 'typeorm';

@Entity({ name: 'question_contributor' })
export class QuestionContributor {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('varchar', { length: 50, nullable: true })
  questionId: string;
  @Column('varchar', { length: 50, nullable: true })
  userId: string;
  @Column('varchar', { length: 50, nullable: true })
  userName: string;
  @Column('timestamp')
  createTime: string;
}
