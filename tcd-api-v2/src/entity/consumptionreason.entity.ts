import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'consumption_reason' })
  export class ConsumptionReason {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false })
    name: string;
  
    @Column({ default: 1 })
    sort_order: number;
  
    @Column({ default: '' })
    updated_by: string;
  
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
  