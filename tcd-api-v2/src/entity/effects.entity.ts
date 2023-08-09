import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FavouriteVideo } from './favouritevideo.entity';
import { User } from './user.entity';
import { VideoComments } from './video_comments.entity';

@Entity({ name: 'effects' })
export class Effects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 150 })
  name: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent_id: User

  @Column({ nullable: true, default: 2 })
  type: number;

  @Column({ nullable: true, default: '' })
  image: string;

  @Column({ nullable: true, default: '' })
  icon: string;

  @Column({ nullable: true, default: 1 })
  sort_order: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updated_by: User

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
