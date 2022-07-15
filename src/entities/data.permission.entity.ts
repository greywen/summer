import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'data_resource' })
export class DataResource {
  @PrimaryColumn({ generated: 'increment' })
  id: number;
  @Column('varchar', { unique: true, length: 50 })
  name: string;
  @Column('timestamp')
  createTime: string;
}
