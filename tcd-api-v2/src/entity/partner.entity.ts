import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';
import bcrypt from 'bcryptjs';
import { ReferralCode } from './referral_code.entity';

@Entity({ name: 'partners' })
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 1 })
  partner_type: number;

  // @Column()
  // partner_admin: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Partner",
  // },

  // @ManyToMany(type => Partner)
  // @JoinTable()
  // partner_admin: Partner[];
  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'partner_admin_id', referencedColumnName: 'id' })
  partner_admin: Partner;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  contact_no: string;

  @Column({ nullable: true })
  city: string;

  @ManyToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state_id: State;

  @ManyToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country_id: Country;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true, unique: true })
  company_email: string;

  @Column({ nullable: true })
  company_phone: string;

  @Column({ nullable: true, unique: true })
  company_email_invoice: string;

  @Column({ nullable: true })
  company_address: string;

  @ManyToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'company_state_Id', referencedColumnName: 'id' })
  company_state_Id: State;

  @Column({ nullable: true })
  company_zipcode: string;

  @ManyToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'company_country_Id', referencedColumnName: 'id' })
  company_country_Id: Country;

  @Column({
    type: 'enum',
    enum: ['', 'Male', 'Female', 'Others', 'Rather not say'],
  })
  gender: string;

  @Column({ type: Date, nullable: true })
  dob: Date;

  @Column({ nullable: true })
  reset_password_otp: string;

  @Column({ default: 0 })
  reset_password_attempted: number;

  @Column({ nullable: true })
  reset_password_attempted_on: Date;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  account_verification_code: string;

  @Column({ default: 0 })
  account_verification_attempted: number;

  @Column({ nullable: true })
  account_verification_attempted_on: Date;

  @Column({ nullable: true })
  login_otp_code: string;

  @Column({ nullable: true })
  login_otp_expiry_on: Date;

  @Column({ nullable: true })
  token: string;

  @Column({ default: 2 })
  twoFA_is_on: number;

  @Column({ nullable: true })
  twoFA_verification_code: string;

  @Column({ default: 1 })
  is_active: number;

  @Column({ default: 0 })
  is_deactivated: boolean;

  @Column({ default: 0 })
  is_deleted: boolean;

  @Column({ nullable: true })
  deleted_at: Date;

  @Column({ nullable: true })
  deactivated_at: Date;

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

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   const salt = await bcrypt.genSalt();
  //   this.password = await bcrypt.hash(this.password, salt);
  // }
  @ManyToOne(() => ReferralCode, (referral_code) => referral_code.id)
  @JoinColumn({ name: 'referral_code', referencedColumnName: 'id' })
  @Column({ nullable: true })
  referral_code: ReferralCode;
}
