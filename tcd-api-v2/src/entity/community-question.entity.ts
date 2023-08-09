import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommunityQuestionCategory } from './community-question-category.entity';
import { CommunityComments } from './community_comments';

@Entity({ name: 'community_question' })
export class CommunityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user: string;

  @Column({ nullable: false })
  category_id: string;

  @ManyToOne(() => CommunityQuestionCategory, (category) => category.id)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CommunityQuestionCategory;

  @Column({ nullable: false })
  question: string;

  @Column({ nullable: true })
  answer: string;

  @Column({ default: 2 })
  display_flag: number;

  @OneToMany(() => CommunityComments, (cmt) => cmt.question)
  comments: CommunityComments[];

  @Column({ default: 0 })
  is_deactivated: number;

  @Column({ default: false })
  is_publish: boolean;

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
