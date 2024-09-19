import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('job_state')
export class JobState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  jobName!: string;

  @Column({ type: 'int', nullable: true })
  lastProcessedUserId!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastRun!: Date;
}
