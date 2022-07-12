import { Column, Entity } from 'typeorm';

@Entity({ name: 'department_permission' })
export class DepartmentPermission {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('uuid')
  departmentid: string;
  @Column('jsonb', { array: false, default: () => "'[]'", nullable: true })
  permissions: string[];
  @Column('timestamp')
  createTime: string;
}
