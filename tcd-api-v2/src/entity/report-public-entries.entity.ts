import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Diary } from './diary.entity';
import { ReportReason } from './reportreason.entity';
import { User } from './user.entity';

@Entity({ name: 'report_public_entries' })
export class ReportPublicEntries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  entry_id: string;

  @ManyToOne(() => Diary, (diary) => diary.id)
  @JoinColumn({ name: 'entry_id', referencedColumnName: 'id' })
  entry: Diary;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  report_reason: string;

  @ManyToOne(() => ReportReason, (report) => report.id)
  @JoinColumn({ name: 'report_reason', referencedColumnName: 'id' })
  reason: ReportReason;

  @Column({ nullable: true })
  reported_by: false;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'reported_by', referencedColumnName: 'id' })
  user: User;

  @Column({ default: 1 })
  is_active: boolean;

  @Column({ default: 0 })
  is_deleted: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updated_at: Date;
}
