import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from './activities.entity';
import { Diary } from './diary.entity';

@Entity({ name: 'user_preactivities' })
export class UserPreActivities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  diary_id: string;

  @ManyToOne(() => Diary)
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'id' })
  diary: Diary;

  @Column({ nullable: false })
  activity_id: string;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activity_id', referencedColumnName: 'id' })
  activity: Activity;

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
