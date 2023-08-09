import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserSymptoms } from './user-symptoms.entity';

@Entity({ name: 'symptoms' })
export class Symptoms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  symptom_id: string;

  @Column({ type: 'varchar', nullable: true })
  actual_symptom_id: string;

  @Column({ type: 'varchar', nullable: true })
  midpoint_symptom_id: string;

  @Column({ type: 'varchar', nullable: true })
  pre_symptom_id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  parent_id: string;

  @Column({ default: 2 })
  type: number;

  @Column({ default: '' })
  image: string;

  @Column({ default: '' })
  icon: string;

  @Column({ default: 1 })
  sort_order: number;

  @Column({ default: '' })
  updated_by: string;

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

  // @OneToMany(() => UserSymptoms, (user) => user.symptom) // specify inverse side as a second parameter
  // user_symptom: UserSymptoms[];
}
