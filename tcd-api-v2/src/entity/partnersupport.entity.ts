import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Partner } from '../entity/partner.entity';

@Entity({ name: 'partner_support' })
export class PartnerSupport {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'partner_id', referencedColumnName: 'id' })
  partner_id: number;

  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  topic: string;

  @Column({ nullable: false })
  message: string;

  @Column({ default: 0 })
  is_deleted: boolean;

  @Column({ nullable: true })
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