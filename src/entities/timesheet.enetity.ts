import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_timesheet' })
export class UserTimesheet {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  timesheet?: ITimeSheet[];
  @Column('date')
  createTime: string;
}

export interface ITimeSheet {
  userid: string;
  name: string;
  value?: string;
  groupid: number;
  updateTime: string;
  createTime: string;
}

export interface ISheetTemplate {
  frontend: string;
  backend: string;
  test: string;
  nodejs: string;
}
