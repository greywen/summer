import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'language' })
export class Language {
  @PrimaryColumn({ generated: 'increment' })
  id: number;
  @Column('varchar', { unique: true, length: 30 })
  name: string; // 语言名称 node
  @Column('varchar', { length: 20 })
  version: string; // 语言版本 v16.13.1
  @Column('varchar', { length: 50 })
  iamge: string; // 镜像名 node
  @Column('varchar', { length: 50 })
  file: string; // 保存文件名 index.js
  @Column('text', { default: null })
  cmd: string; // 运行代码的命令 node index.js
  @Column('smallint')
  timeout: number; // 运行超时时间 秒 60
  @Column('smallint')
  memory: number; // 分配容器内存大小 MB 100
  @Column('varchar', { length: 10 })
  cpuset: string; // 允许容器使用CPU核心 0-4 或者 1,2,4
  @Column('text')
  captureCode: string; // 数据收集代码 运行时长，占用内存等
  @Column('text', { nullable: true })
  initialCode: string; // 初始代码
  @Column('timestamp')
  craeteTime: string;
}
