import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Diary } from './diary.entity';

@Entity({ name: 'cmspages' })
export class CmsPages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  page_title: string;

  @Column({ type: 'longtext', nullable: false })
  page_content: string;

  @Column({ type: 'varchar', nullable: true })
  banner_image: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

  @Column({ type: 'int', default: 1 })
  content_type: number;

  // @ManyToOne(() => Diary, (dairy) => dairy.id)
  // @JoinColumn({ name: 'dairy', referencedColumnName: 'id' })
  // state: Diary;

  @Column({ type: 'varchar', nullable: true })
  parent_content: string;

  @Column({ type: 'varchar', nullable: true })
  meta_title: string;

  @Column({ type: 'varchar', nullable: true })
  meta_description: string;

  @Column({ type: 'varchar', nullable: true })
  meta_keywords: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: 0 })
  sort_order: number;

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
