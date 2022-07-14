import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_department' })
export class UserDepartment {
  @PrimaryColumn({ generated: 'increment' })
  id: number;
  @Column('varchar')
  userid: string;
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  departmentids: string[];
  @Column('timestamp')
  createTime: string;
}
