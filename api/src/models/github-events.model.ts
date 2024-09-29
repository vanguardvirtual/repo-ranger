import { Username } from '@models/username.model';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('github_events')
export class GithubEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  username_id!: number;

  @Column({ type: 'int' })
  github_repo_id!: number;

  @Column({ type: 'varchar' })
  event_type!: string;

  @Column({ type: 'int', default: 0 })
  event_size!: number; // (that number is a multiplier for the score of this event )

  @Column({ type: 'varchar', nullable: true, unique: true })
  github_id!: string;

  @Column({ type: 'text', nullable: true })
  message!: string;

  @Column({ type: 'datetime' })
  event_date!: Date;

  @ManyToOne(() => Username, (username) => username.events)
  username!: Relation<Username>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at!: Date;
}
