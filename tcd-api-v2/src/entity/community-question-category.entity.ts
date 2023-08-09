import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

  
  
  @Entity({ name: 'community_question_category' })
  export class CommunityQuestionCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false, length: 150 })
    name: string;

  
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
  