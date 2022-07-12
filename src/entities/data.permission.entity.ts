import { Column, Entity } from 'typeorm';

@Entity({ name: 'data_permission' })
export class DataPermission {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('varchar', { unique: true, length: 50 })
  name: string;
  @Column('timestamp')
  createTime: string;
}
