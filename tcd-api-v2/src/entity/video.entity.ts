import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { FavouriteVideo } from './favouritevideo.entity';
import { VideoComments } from './video_comments.entity';

@Entity({ name: 'video' })
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 150 })
  title: string;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4, 5],
    default: 1,
  })
  type: number;

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  video_thumb_image: string;

  @Column({ default: 0 })
  duration: number;

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

  @OneToOne(() => FavouriteVideo, (fv) => fv.video_id)
  favourite_video: FavouriteVideo;

  @OneToMany(() => VideoComments, (cmt) => cmt.video)
  comments: VideoComments[];
}
