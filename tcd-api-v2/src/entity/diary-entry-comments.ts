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
import { User } from './user.entity';

@Entity({ name: 'entry_comments' })
export class EntryComments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  commented_by: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'commented_by', referencedColumnName: 'id' })
  user: User;

  @Column({
    nullable: false,
  })
  entry_id: string;

  @ManyToOne(() => Diary, (entry) => entry.id)
  @JoinColumn({ name: 'entry_id', referencedColumnName: 'id' })
  entry: Diary;

  @Column({ nullable: false, type: 'longtext' })
  comment: string;

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
