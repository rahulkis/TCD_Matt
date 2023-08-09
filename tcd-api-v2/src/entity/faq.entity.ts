import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FaqCategory } from './faqcategory.entity';

@Entity({ name: 'faq' })
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;

  @Column({ nullable: true, type: 'longtext' })
  answer: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @ManyToOne(() => FaqCategory, (category) => category.id)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category_id: FaqCategory;

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
