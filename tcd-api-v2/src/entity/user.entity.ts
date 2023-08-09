import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { ConsumptionFrequency } from './consumptionfrequency.entity';
import { ConsumptionReason } from './consumptionreason.entity';
import { Country } from './country.entity';
import { Physiques } from './physiques.entity';
import { State } from './state.entity';
import { Strain } from './strain.entity';
import bcrypt from 'bcryptjs';
import { VideoComments } from './video_comments.entity';
import { Diary } from './diary.entity';
// import { Symptoms } from './symptoms.entity';
// import { Effects } from './effects.entity';
// import { Activity } from './activities.entity';
// import { Conditions } from './conditions';
// import { Cannabinoids } from './cannabinoids.entity';
import { UserSymptoms } from './user-symptoms.entity';
import { UserEffects } from './user-effects.entity';
import { UserActivities } from './user-activities.entity';
import { UserConditions } from './user-conditions.entity';
import { UserCannabinoids } from './user-cannabinoids.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 2 })
  user_type: number;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  contact_no: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  city: string;
  //-------------------------------------

  @ManyToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'state', referencedColumnName: 'id' })
  state: State;

  @ManyToOne(() => Country, (state) => state.id)
  @JoinColumn({ name: 'country', referencedColumnName: 'id' })
  country: Country;

  //----------------------------------

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({
    type: 'enum',
    enum: ['', 'Male', 'Female', 'Others', 'Rather not say'],
  })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  dob: Date;
  //---------------------------------
  @Column({ nullable: true })
  cannabis_consumption_id: string;

  @ManyToOne(() => ConsumptionFrequency, (cf) => cf.id)
  @JoinColumn({ name: 'cannabis_consumption_id', referencedColumnName: 'id' })
  cannabis_consumption: ConsumptionFrequency;

  @Column({ nullable: true })
  physique_id: string;

  @ManyToOne(() => Physiques, (physique) => physique.id)
  @JoinColumn({ name: 'physique_id', referencedColumnName: 'id' })
  physique: Physiques;

  //-----------------------------------

  @Column({
    type: 'enum',
    enum: [
      '',
      'Not active',
      'Slightly Active',
      'Somewhat active',
      'Quite active',
      'Very active',
    ],
  })
  activity_level: string;

  @Column({ nullable: true })
  height: string;

  @Column({ type: 'enum', enum: ['', 'cm', 'ft'] })
  height_scale: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ type: 'enum', enum: ['', 'kg', 'lb'] })
  weight_scale: string;
  //--------------------------------------------------

  // @ManyToOne(() => Symptoms, (s) => s.id)
  // @JoinColumn({ name: 'symptom', referencedColumnName: 'id' })
  // symptoms: Symptoms;

  // @ManyToOne(() => Effects, (e) => e.id)
  // @JoinColumn({ name: 'effect', referencedColumnName: 'id' })
  // effect: Effects;

  // @ManyToOne(() => Activity, (a) => a.id)
  // @JoinColumn({ name: 'activity', referencedColumnName: 'id' })
  // activities: Activity;

  // @ManyToOne(() => Conditions, (c) => c.id)
  // @JoinColumn({ name: 'condition', referencedColumnName: 'id' })
  // condition: Conditions;

  @Column({ nullable: true })
  strain_id: string;

  @ManyToOne(() => Strain, (strain) => strain.id)
  @JoinColumn({ name: 'strain_id', referencedColumnName: 'id' })
  favourite_strains: Strain;

  // @ManyToOne(() => Cannabinoids, (c) => c.id)
  // @JoinColumn({ name: 'cannabinoids', referencedColumnName: 'id' })
  // cannabinoids: Cannabinoids;

  @ManyToOne(() => ConsumptionReason, (reason) => reason.id)
  @JoinColumn({ name: 'consumption_reason', referencedColumnName: 'id' })
  consumption_reason: ConsumptionReason;

  //-------------------------------------------------

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

  @Column({ default: 0 })
  device_type: number;

  @Column({ nullable: true })
  device_push_key: string;

  @Column('simple-array')
  device_ids: string[];

  @Column({ type: 'int', default: 2, nullable: false })
  show_tutorial_flag: number;

  @Column({ type: 'int', default: 2, nullable: false })
  get_tcd_update: number;

  @Column({ default: 2 })
  twoFA_is_on: number;

  @Column({ nullable: true })
  twoFA_verification_code: string;

  @Column({ default: 2 })
  post_consumption_reminder_is_on: number;

  @Column({ default: 0 })
  post_consumption_reminder_interval: number;

  @Column({ nullable: true })
  last_reminder_sent_at: Date;

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

  @BeforeInsert()
  async hashPassword(): Promise<any> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @OneToMany(() => VideoComments, (vc) => vc.user)
  video_comments: VideoComments[];

  @OneToMany(() => Diary, (diary) => diary.user)
  diary: Diary[];

  @OneToMany(() => UserSymptoms, (symptom) => symptom.user)
  symptoms: UserSymptoms[];

  @OneToMany(() => UserEffects, (effect) => effect.user)
  effect: UserEffects[];

  @OneToMany(() => UserActivities, (activity) => activity.user)
  activities: UserActivities[];

  @OneToMany(() => UserConditions, (condition) => condition.user)
  condition: UserConditions[];

  @OneToMany(() => UserCannabinoids, (cannabinoid) => cannabinoid.user)
  cannabinoids: UserCannabinoids[];
}
