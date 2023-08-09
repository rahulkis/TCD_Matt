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
import { Symptoms } from './symptoms.entity';

@Entity({ name: 'user_actualsymptoms' })
export class UserActualSymptoms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  diary_id: string;

  @ManyToOne(() => Diary)
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'id' })
  diary: Diary;

  @Column({ nullable: false })
  symptom_id: string;

  @ManyToOne(() => Symptoms)
  @JoinColumn({ name: 'symptom_id', referencedColumnName: 'id' })
  symptom: Symptoms;

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
