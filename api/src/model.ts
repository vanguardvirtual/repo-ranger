import { getEmoji } from '@/service';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

@Entity('usernames')
export class Username extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: 'varchar' })
  username!: string;

  @Column({ type: 'int', default: 0 })
  score!: number;

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

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
