import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Username } from './username.model';

@Entity('twitter_posts')
export class TwitterPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  username_id!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'enum', enum: ['user_post_type', 'project_post_type'], nullable: true })
  post_type!: string;

  @Column({ type: 'varchar', nullable: true })
  twitter_id!: string;

  @Column({ type: 'datetime', nullable: true })
  cron_check!: Date;

  @ManyToOne(() => Username, (username: Username) => username.twitter_posts, { lazy: true })
  username!: Relation<Username>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at!: Date;
}
