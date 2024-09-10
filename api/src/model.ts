import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, Index } from 'typeorm';

@Entity('usernames')
@Index(['score'])
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

  @Column({ type: 'text', nullable: true })
  ai_description!: string;

  @Column({ type: 'int', default: 0 })
  followers!: number;

  @Column({ type: 'int', default: 0 })
  following!: number;

  @Column({ type: 'datetime', nullable: true })
  ai_description_updated_at!: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
