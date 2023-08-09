import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'faq_category' })
  export class FaqCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    parent_id: string;

    @Column({ default:2 })
    type: number;
  
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
  }
  