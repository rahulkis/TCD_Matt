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

@Entity({ name: 'search_logs' })
export class SearchLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  search_terms: string;

  @Column({ default: 2 })
  type: string;

  @Column({ nullable: false })
  search_by: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'search_by', referencedColumnName: 'id' })
  user: User;

  @Column({ default: 'completed' })
  status: string;

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
