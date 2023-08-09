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
import { Conditions } from './conditions';
import { Diary } from './diary.entity';

@Entity({ name: 'user_desiredconditions' })
export class UserDesiredConditions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  diary_id: string;

  @ManyToOne(() => Diary)
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'id' })
  diary: Diary;

  @Column({ nullable: false })
  condition_id: string;

  @ManyToOne(() => Conditions)
  @JoinColumn({ name: 'condition_id', referencedColumnName: 'id' })
  condition: Conditions;

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
