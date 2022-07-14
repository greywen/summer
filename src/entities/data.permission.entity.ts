import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'data_permission' })
export class DataPermission {
  @PrimaryColumn({ generated: 'increment' })
  id: number;
  @Column('varchar', { unique: true, length: 50 })
  name: string;
  @Column('timestamp')
  createTime: string;
}
