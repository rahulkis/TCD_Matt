import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ name: 'favourite_video' })
export class FavouriteVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 150 })
  user_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: false })
  video_id: string;

  @OneToOne(() => Video, (video) => video.id)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video: Video;

  @Column({ nullable: true })
  is_favourite: number;

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
