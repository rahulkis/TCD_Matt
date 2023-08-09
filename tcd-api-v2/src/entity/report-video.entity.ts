import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportReason } from './reportreason.entity';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ name: 'report_video' })
export class ReportVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  video_id: string;

  @ManyToOne(() => Video, (vid) => vid.id)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video: Video;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  report_reason: string;

  @ManyToOne(() => ReportReason, (repReason) => repReason.id)
  @JoinColumn({ name: 'report_reason', referencedColumnName: 'id' })
  reportReason: ReportReason;

  @Column({ nullable: false })
  reported_by: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'reported_by', referencedColumnName: 'id' })
  reportedBy: User;

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
