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
import { Campaign } from './campaign.entity';

@Entity({ name: 'advertisement' })
export class Advertisement {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar', nullable: true
  })
  partner_id: string;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'partner_id', referencedColumnName: 'id' })
  partner: Partner;

  @Column({
    type: 'varchar',
  })
  campaign_id: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.id)
  @JoinColumn({ name: 'campaign_id', referencedColumnName: 'id' })
  campaign: Campaign;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'varchar', nullable: false })
  headline: string;

  @Column({ type: 'varchar', nullable: false })
  body: string;

  @Column({ type: 'varchar', nullable: false })
  link: string;

  @Column('simple-array')
  placement_page: string[];

  @Column({ type: 'int' })
  video_package_qty: number;

  @Column({ type: 'int' })
  total_cost: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'varchar', nullable: true })
  advertisement_image: string;

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
