import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ArticleCategories } from './articlecategory.entity';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
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

  @ManyToOne(() => ArticleCategories, (category) => category.id)
  @JoinColumn({ name: 'category', referencedColumnName: 'id' })
  category: ArticleCategories;
}
