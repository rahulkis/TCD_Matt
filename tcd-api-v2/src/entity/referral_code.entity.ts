import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity({ name: 'referral_code' })
export class ReferralCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'code_owner_id', referencedColumnName: 'id' })
  code_owner_id: Partner;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ nullable: false })
  code_active: number;

  @Column({ type: Date, nullable: false })
  code_active_date: Date;

  @Column({ type: Date, nullable: false })
  code_deactive_date: Date;

  @Column({ nullable: false })
  code_uses: number;
}
