import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_department' })
export class UserDepartment {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('uuid')
  userid: string;
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  departmentids: string[];
  @Column('timestamp')
  createTime: string;
}
