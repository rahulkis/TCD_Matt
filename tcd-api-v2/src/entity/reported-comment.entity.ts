import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ReportReason } from './reportreason.entity';
import { User } from './user.entity';
import { Video } from './video.entity';
import { VideoComments } from './video_comments.entity';

@Entity({ name: 'reported_comment' })
export class ReportedComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  video_id: string;

  @ManyToOne(() => Video, (video) => video.id)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video: Video;

  @Column({ nullable: false })
  comment_id: string;

  @ManyToOne(() => VideoComments, (user) => user.id)
  @JoinColumn({ name: 'commented_by', referencedColumnName: 'id' })
  comment: VideoComments;

  @Column({ nullable: true })
  commented_by: string;

  @ManyToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'commented_by', referencedColumnName: 'id' })
  commenting_user: User;

  @Column({ nullable: true })
  report_reason: string;

  @ManyToOne(() => ReportReason, (report) => report.id)
  @JoinColumn({ name: 'report_reason', referencedColumnName: 'id' })
  report: ReportReason;

  @Column({ nullable: false })
  reported_by: string;

  @ManyToMany(() => User, (user) => user.id)
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
