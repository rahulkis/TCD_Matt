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

@Entity({ name: 'favouriteentry' })
export class FavouriteEntry {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Diary, (diary) => diary.id)
  @JoinColumn({ name: 'entry_id', referencedColumnName: 'id' })
  entry_id: Diary;

  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  is_favourite: number;

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

  @Column({ type:'int', default: 1 })
  is_active: number;

  @Column({ type:'int', default: 0 })
  is_deleted: number;

}