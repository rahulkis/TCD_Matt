import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommunityQuestion } from './community-question.entity';

@Entity({ name: 'community_comments' })
export class CommunityComments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  commented_by: string;

  // @ManyToOne(() => User, (user) => user.id)
  // @JoinColumn({ name: 'commented_by', referencedColumnName: 'id' })
  // user: User;

  @Column({
    nullable: false,
  })
  question_id: string;

  @ManyToOne(() => CommunityQuestion, (question) => question.id)
  @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
  question: CommunityQuestion;

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
