import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

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
