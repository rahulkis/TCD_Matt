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
import { Effects } from './effects.entity';

@Entity({ name: 'user_preeffects' })
export class UserPreEffects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  diary_id: string;

  @ManyToOne(() => Diary)
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'id' })
  diary: Diary;

  @Column({ nullable: false })
  effect_id: string;

  @ManyToOne(() => Effects)
  @JoinColumn({ name: 'effect_id', referencedColumnName: 'id' })
  effect: Effects;

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
