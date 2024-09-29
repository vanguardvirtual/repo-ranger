import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Username } from './username.model';

@Entity('repos')
export class Repo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  username_id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text' })
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

  @ManyToOne(() => Username, (username: Username) => username.repos)
  username!: Relation<Username>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at!: Date;
}
