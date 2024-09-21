import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('repos')
export class Repo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  username_id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @Column({ type: 'varchar' })
  github_url!: string;

  @Column({ type: 'int', nullable: true, unique: true })
  github_id!: number;

  @Column({ type: 'int', default: 0 })
  stars!: number;

  @Column({ type: 'int', default: 0 })
  forks!: number;

  @Column({ type: 'int', default: 0 })
  issues!: number;

  @Column({ type: 'int', default: 0 })
  pull_requests!: number;

  @Column({ type: 'int', default: 0 })
  commits!: number;

  @Column({ type: 'int', default: 0 })
  comments!: number;

  @Column({ type: 'datetime', nullable: true })
  created_at!: Date;
}
