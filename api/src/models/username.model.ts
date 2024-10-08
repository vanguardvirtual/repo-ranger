import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  Index,
  OneToMany,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { TwitterPost } from './twitter-posts.model';
import { GithubEvent } from '@models/github-events.model';
import { Repo } from './repos.model';

@Entity('usernames')
@Index(['score'])
export class Username extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar', nullable: true })
  email!: string;

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
  twitter_posts!: Relation<TwitterPost[]>;

  total_score(): number {
    return this.score + this.extra_score;
  }

  @OneToMany(() => GithubEvent, (github_event: GithubEvent) => github_event.username)
  events!: Relation<GithubEvent[]>;

  @OneToMany(() => Repo, (repo: Repo) => repo.username)
  repos!: Relation<Repo[]>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at!: Date;
}
