import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'data_department' })
export class DataDepartment {
  @PrimaryColumn({ generated: 'increment' })
  id: number;
  @Column('varchar', { unique: true, length: 20 })
  name: string;
  @Column('timestamp')
  craeteTime: string;
}
