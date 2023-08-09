import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Symptoms } from './symptoms.entity';
import { User } from './user.entity';

@Entity({ name: 'user_symptoms' })
export class UserSymptoms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: false })
  symptom_id: string;

  @ManyToOne(() => Symptoms)
  @JoinColumn({ name: 'symptom_id', referencedColumnName: 'id' })
  symptom: Symptoms

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
