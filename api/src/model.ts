import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, Index, OneToMany, ManyToOne } from 'typeorm';

@Entity('usernames')
@Index(['score'])
export class Username extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: 'varchar' })
  username!: string;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'int', default: 0 })
  extra_score!: number;

  @Column({ type: 'varchar', default: 'Earth' })
  location!: string;

  @Column({ type: 'varchar', default: 'Typescript' })
  fav_language!: string;

  @Column({ type: 'int', default: 0 })
  contributions!: number;

  @Column({ type: 'varchar', default: 'https://avatars.githubusercontent.com/u/1?v=4' })
  avatar!: string;

  @Column({ type: 'varchar', default: 'Hello, I am a developer' })
  bio!: string;

  @Column({ type: 'varchar', default: 'John Doe' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  ai_description!: string;

  @Column({ type: 'varchar', nullable: true })
  ai_nickname!: string;

  @Column({ type: 'int', default: 0 })
  followers!: number;

  @Column({ type: 'int', default: 0 })
  following!: number;

  @Column({ type: 'varchar', nullable: true })
  github_url!: string;

  @Column({ type: 'varchar', nullable: true })
  twitter_username!: string;

  @Column({ type: 'datetime', nullable: true })
  ai_description_updated_at!: Date;

  @OneToMany(() => TwitterPost, (twitter_post: TwitterPost) => twitter_post.username)
  twitter_posts!: TwitterPost[];

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  total_score(): number {
    return this.score + this.extra_score;
  }
}

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'text' })
  message!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}

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
