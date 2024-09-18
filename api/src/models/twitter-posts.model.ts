import { Username } from '@/models/username.model';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';

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

  @Column({ type: 'datetime' })
  created_at!: Date;

  @ManyToOne(() => Username, (username: Username) => username.twitter_posts)
  username!: Username;
}
