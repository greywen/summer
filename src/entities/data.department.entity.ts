import { Column, Entity } from 'typeorm';

@Entity({ name: 'data_department' })
export class DataDepartment {
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  @Column('varchar', { unique: true, length: 20 })
  name: string;
  @Column('timestamp')
  craeteTime: string;
}
