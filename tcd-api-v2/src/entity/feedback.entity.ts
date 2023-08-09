import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'feedback' })
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['Diary', 'Data Insight', 'Entourage Profile', 'Entry Summary', 'New Entry', 'Community', 'Cannabis Insignt', 'Recommendations', 'Profile', 'Settings', 'FAQ', 'Other'],
  })
  area_of_improvement: string;

  @Column({ nullable: false })
  feedback: string;

  @Column({ default: 1 })
  is_active: Number;

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
