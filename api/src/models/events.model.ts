import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('events')
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  username_id!: number;

  @Column({ type: 'int' })
  repo_id!: number;

  @Column({ type: 'varchar' })
  event_type!: string;

  @Column({ type: 'datetime' })
  created_at!: Date;

  @Column({ type: 'int', default: 0 })
  event_size!: number; // (that number is a multiplier for the score of this event )

  @Column({ type: 'varchar', nullable: true })
  github_id!: string;

  @Column({ type: 'text', nullable: true })
  message!: string;
}
