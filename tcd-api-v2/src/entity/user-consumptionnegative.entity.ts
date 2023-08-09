import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ConsumptionNegative } from './consumptionnegative.entity';
import { Diary } from './diary.entity';

@Entity({ name: 'user_negative_consumption' })
export class UserNegativeConsumption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  diary_id: string;

  @ManyToOne(() => Diary)
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'id' })
  diary: Diary;

  @Column({ nullable: false })
  negative_id: string;

  @ManyToOne(
    () => ConsumptionNegative,
    (consumptionnegative) => consumptionnegative.id,
  )
  @JoinColumn({ name: 'consumption_negative', referencedColumnName: 'id' })
  consumption_negative: ConsumptionNegative;

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
