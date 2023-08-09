import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Partner } from './partner.entity';

@Entity({ name: 'campaign' })
export class Campaign {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  partner_id: string;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'partner_id', referencedColumnName: 'id' })
  partner: Partner;

  @Column({ type: 'varchar' })
  campaign_name: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  is_deleted: number;

  @Column({ type: 'date', default: null })
  deleted_at: Date;

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

