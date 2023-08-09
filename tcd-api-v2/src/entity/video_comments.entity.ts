import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ name: 'video_comments' })
export class VideoComments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  commented_by: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'commented_by', referencedColumnName: 'id' })
  user: User;

  @Column({
    nullable: false,
  })
  video_id: string;

  @ManyToOne(() => Video, (video) => video.id)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video: Video;

  @Column({ nullable: false, type: 'longtext' })
  comment: string;

  @Column({ default: 0 })
  reported_count: number;

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
