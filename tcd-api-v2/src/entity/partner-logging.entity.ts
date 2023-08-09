import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity({ name: 'partner_logging' })
export class PartnerLogging {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'partner_id', referencedColumnName: 'id' })
  partner_id: string;

  @Column({ nullable: false })
  partner_token: string

  @Column({ default: 0 })
  is_deleted: boolean;

  @Column({ default: 0 })
  is_logout: boolean;

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
