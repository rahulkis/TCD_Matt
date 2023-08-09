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

@Entity({ name: 'user_blocked' })
export class UserBlocked {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  blocked_userid: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'blocked_userid', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: false })
  blocked_by: string;

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
