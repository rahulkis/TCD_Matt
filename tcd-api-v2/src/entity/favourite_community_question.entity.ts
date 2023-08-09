import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CommunityQuestion } from './community-question.entity';
import { User } from './user.entity';

@Entity({ name: 'favourite_community_question' })
export class FavouriteCommunityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 150 })
  user_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: false })
  question_id: string;

  @ManyToOne(() => CommunityQuestion, (fav) => fav.id)
  @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
  question: CommunityQuestion;

  @Column({ nullable: true })
  is_favourite: number;

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
