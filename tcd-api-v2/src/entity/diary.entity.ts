import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { EntryComments } from './diary-entry-comments';
import { Product } from './product.entity';
import { User } from './user.entity';
import { ConsumptionNegative } from './consumptionnegative.entity';
import { Effects } from './effects.entity';
import { Activity } from './activities.entity';
import { Symptoms } from './symptoms.entity';
import { Conditions } from './conditions';
import { Coa } from './coa.entity';
import { UserPreSymptoms } from './user-presymptoms';
import { UserActualEffects } from './user-actualeffects';
import { UserDesiredEffects } from './user-desiredeffects';
import { UserPreActivities } from './user-preactivities';
import { UserPreConditions } from './user-preconditions';
import { CannabinoidProfile } from './cannabinoid-profile.entity';
import { TerpenesProfile } from './terpenes-profile.entity';
import { Terpenes } from './terpenes.entity';
import { UserPreEffects } from './user-preeffects.entity';
import { UserDesiredActivities } from './user-desiredactivities.entity';
import { UserDesiredSymptoms } from './user-desiredsymptoms.entity';
import { UserDesiredConditions } from './user-desiredconditions.entity';
import { UserActualConditions } from './user-actualconditions.entity';
import { UserActualActivities } from './user-actualactivities.entity';
import { UserActualSymptoms } from './user-actualsymptoms.entity';
import { UserMidPointEffects } from './user-midpointeffects.entity';
import { UserMidPointActivities } from './user-midpointactivities.entity';
import { UserMidPointSymptoms } from './user-midpointsymptoms.entity';
import { UserMidPointConditions } from './user-midpointconditions.entity';
import { ConsumptionMethod } from './consumption-method.entity';
import { Moods } from './mood.entity';
import { UserNegativeConsumption } from './user-consumptionnegative.entity';

@Entity({ name: 'diary' })
export class Diary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //--------------------------------
  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
  //----------------------------------------

  //------------------------------------------
  @Column({ nullable: true })
  product_id: string;

  @ManyToOne(() => Product, (user) => user.id)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
  //-------------------------------------------------------------

  @Column({ nullable: true })
  coa_id: string;

  @ManyToOne(() => Coa, (c) => c.id)
  @JoinColumn({ name: 'coa_id', referencedColumnName: 'id' })
  coa: Coa;

  @Column({ nullable: false })
  day_of_week: string;

  @Column({ nullable: true })
  day_of_month: number;

  @Column({ nullable: true })
  month: number;

  @Column({ nullable: true })
  year: number;

  @Column({ default: 2 })
  is_public: number;

  @Column({ default: 2 })
  is_complete: number;

  @Column({ default: 2 })
  average_ratings: string;

  // @Column({ nullable: true })
  // cannabinoid_profile: string;

  // @Column({ nullable: true })
  // terpenes: string;

  // @Column({ nullable: true })
  // pre_symptoms: string;

  // @ManyToOne(() => Symptoms, (symptoms) => symptoms.id)
  // @JoinColumn({ name: 'pre_symptoms', referencedColumnName: 'id' })
  // pre_symptoms: Symptoms;

  // @Column({ nullable: true })
  // pre_activities: string;

  // @ManyToOne(() => Activity, (activity) => activity.id)
  // @JoinColumn({ name: 'pre_activities', referencedColumnName: 'id' })
  // pre_activities: Activity;

  // @Column({ nullable: true })
  // pre_condition: string;

  // @ManyToOne(() => Conditions, (conditions) => conditions.id)
  // @JoinColumn({ name: 'pre_condition', referencedColumnName: 'id' })
  // pre_condition: Conditions;

  // @Column({ nullable: true })
  // pre_effects: string;

  // @Column({ nullable: true })
  // desired_effects: string;

  // @ManyToOne(() => Effects, (effects) => effects.id)
  // @JoinColumn({ name: 'desired_effects', referencedColumnName: 'id' })
  // desired_effects: Effects;

  // @Column({ nullable: true })
  // desired_activities: string;

  // @ManyToOne(() => Activity, (activity) => activity.id)
  // @JoinColumn({ name: 'desired_activities', referencedColumnName: 'id' })
  // desired_activities: Activity;

  // @Column({ nullable: true })
  // desired_symptoms: string;

  // @ManyToOne(() => Symptoms, (symptoms) => symptoms.id)
  // @JoinColumn({ name: 'desired_symptoms', referencedColumnName: 'id' })
  // desired_symptoms: Symptoms;

  // @Column({ nullable: true })
  // desired_condition: string;

  // @ManyToOne(() => Conditions, (conditions) => conditions.id)
  // @JoinColumn({ name: 'desired_condition', referencedColumnName: 'id' })
  // desired_condition: Conditions;

  // @Column({ nullable: true })
  // actual_effects: string;

  // @ManyToOne(() => Effects, (effects) => effects.id)
  // @JoinColumn({ name: 'actual_effects', referencedColumnName: 'id' })
  // actual_effects: Effects;

  // @Column({ nullable: true })
  // actual_condition: string;

  // @ManyToOne(() => Conditions, (conditions) => conditions.id)
  // @JoinColumn({ name: 'actual_condition', referencedColumnName: 'id' })
  // actual_condition: Conditions;

  // @Column({ nullable: true })
  // actual_activities: string;

  // @ManyToOne(() => Activity, (activity) => activity.id)
  // @JoinColumn({ name: 'actual_activities', referencedColumnName: 'id' })
  // actual_activities: Activity;

  // @Column({ nullable: true })
  // actual_symptoms: string;

  // @ManyToOne(() => Symptoms, (symptoms) => symptoms.id)
  // @JoinColumn({ name: 'actual_symptoms', referencedColumnName: 'id' })
  // actual_symptoms: Symptoms;

  // @Column({ nullable: true })
  // midpoint_effects: string;

  // @ManyToOne(() => Effects, (symptoms) => symptoms.id)
  // @JoinColumn({ name: 'midpoint_effects', referencedColumnName: 'id' })
  // midpoint_effects: Effects;

  // @Column({ nullable: true })
  // midpoint_activities: string;

  // @ManyToOne(() => Activity, (activity) => activity.id)
  // @JoinColumn({ name: 'midpoint_activities', referencedColumnName: 'id' })
  // midpoint_activities: Activity;

  // @Column({ nullable: true })
  // midpoint_symptoms: string;

  // @ManyToOne(() => Symptoms, (symptoms) => symptoms.id)
  // @JoinColumn({ name: 'midpoint_symptoms', referencedColumnName: 'id' })
  // midpoint_symptoms: Symptoms;

  // @Column({ nullable: true })
  // midpoint_condition: string;

  // @ManyToOne(() => Conditions, (conditions) => conditions.id)
  // @JoinColumn({ name: 'midpoint_condition', referencedColumnName: 'id' })
  // midpoint_condition: Conditions;

  //------------------------------------
  @Column({ nullable: true })
  comments: string;

  @ManyToOne(() => ConsumptionMethod, (conditions) => conditions.id)
  @JoinColumn({ name: 'consumption_method', referencedColumnName: 'id' })
  consumption_method: ConsumptionMethod;


  @Column({ nullable: true })
  consumption_scale: string;

  @Column({ nullable: true })
  consumption_unit: string;

  @Column({
    type: 'enum',
    default:'',
    enum: ['','Yes','No'],
  })
  eat_before_consumption: string;

  @Column({
    type: 'enum',
    default:'',
    enum: ['','Yes','No'],
  })
  consume_now: string;


  @Column({
    type: 'enum',
    default:'',
    enum: ['','Morning','Afternoon','Evening','Late Night'],
  })
  consumption_time: string;


  @Column({
    type: 'enum',
    default:'',
    enum: ['','Home','Friend','Out','Social'],
  })
  consumption_place: string;


  @Column({
    type: 'enum',
    default:'',
    enum: ['','Alone','Partner','Friend','Group'],
  })
  consumption_partner: string;

  @ManyToOne(() => UserNegativeConsumption, (consumptionnegative) => consumptionnegative.id)
  @JoinColumn({ name: 'consumption_negative', referencedColumnName: 'id' })
  consumption_negative: UserNegativeConsumption[];

  @Column({ nullable: true })
  mood_before_consumption_id: string;

  @ManyToOne(() => Moods, (moods) => moods.id)
  @JoinColumn({ name: 'mood_before_consumption_id', referencedColumnName: 'id' })
  mood_before_consumption: Moods;

  @Column({
    type: 'enum',
    default:'',
    enum: ['','Yes','No'],
  })
  consume_cannabis_before: string;

  @Column({ nullable: true, default:'' })
  consume_time: string;

  @Column({ nullable: true , default:''})
  keywords: string;

  @Column({ default: 0 })
  is_favourite: number;

  @Column({ default: false })
  enjoy_taste: Boolean;

  @Column({ default: 2 })
  has_incompleteness_notified: number;

  @Column({ default: 0 })
  is_deactivated: number;

  // @Column({ nullable: true })
  // updated_by: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updated_by: User;

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

  // @Column()
  // entry_id: string;

  // @OneToMany(() => FavouriteEntry, (favouriteentry) => favouriteentry.id)
  // @JoinColumn({ name: 'entry_id', referencedColumnName: 'id' })
  // get_entry_id: FavouriteEntry;

    // @Column('simple-array')
    // user_comments:string[];

    // @Column({ type: 'varchar' })
    // user_comment:string;

    // @ManyToOne(() => UserComments, (usercomments) => usercomments.id)
    // @JoinColumn({ name: 'user_comments', referencedColumnName: 'id' })
    // usercomments: UserComments;

  @OneToMany(() => EntryComments, (cmt) => cmt.entry)
  user_comments: EntryComments[];

  @OneToMany(() => UserPreSymptoms, (ps) =>ps.diary)
  pre_symptoms: UserPreSymptoms[];


  @OneToMany(() => UserActualEffects, (ef) => ef.diary)
  actual_effects: UserActualEffects[];

  @OneToMany(() => UserDesiredEffects, (effect) => effect.diary)
  desired_effects: UserDesiredEffects[];

  @OneToMany(() => UserPreActivities, (activity) => activity.diary)
  pre_activities: UserPreActivities[];

  @OneToMany(() => UserPreConditions, (condition) => condition.diary)
  pre_condition: UserPreConditions[];

  @OneToMany(() => UserPreEffects, (effect) => effect.diary)
  pre_effects: UserPreEffects[];

  @OneToMany(() => UserDesiredActivities, (activity) => activity.diary)
  desired_activities: UserDesiredActivities[];

  @OneToMany(() => UserDesiredSymptoms, (symptom) =>symptom.diary)
  desired_symptoms: UserDesiredSymptoms[];

  @OneToMany(() => UserDesiredConditions, (condition) => condition.diary)
  desired_condition: UserDesiredConditions[];

  @OneToMany(() => UserActualConditions, (condition) => condition.diary)
  actual_condition: UserActualConditions[];

  @OneToMany(() => UserActualActivities, (activity) => activity.diary)
  actual_activities: UserActualActivities[];

  @OneToMany(() => UserActualSymptoms, (symptom) =>symptom.diary)
  actual_symptoms: UserActualSymptoms[];

  @OneToMany(() => UserMidPointEffects, (effect) => effect.diary)
  midpoint_effects: UserMidPointEffects[];

  @OneToMany(() => UserMidPointActivities, (activity) => activity.diary)
  midpoint_activities: UserMidPointActivities[];

  @OneToMany(() => UserMidPointSymptoms, (symptom) =>symptom.diary)
  midpoint_symptoms: UserMidPointSymptoms[];

  @OneToMany(() => UserMidPointConditions, (condition) => condition.diary)
  midpoint_condition: UserMidPointConditions[];

  @OneToMany(() => CannabinoidProfile, (cannabinoid) => cannabinoid.diary)
  cannabinoid_profile: CannabinoidProfile[];

  @OneToMany(() => TerpenesProfile, (terpenes) => terpenes.diary)
  terpenes: TerpenesProfile[];
}
