import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

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

  @Column({ type: 'datetime' })
  created_at!: Date;
}
