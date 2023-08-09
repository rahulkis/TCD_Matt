import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Strain } from './strain.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Summary } from './coa-summary.entity';
import { double } from 'aws-sdk/clients/lightsail';
import { CannabinoidProfile } from './cannabinoid-profile.entity';
import { Terpenes } from './terpenes.entity';
import { Pesticides } from './pesticides.entity';
import { Microbials } from './microbials.entity';
import { Mycotoxins } from './mycotoxins.entity';
import { HeavyMetals } from './heavy-metals.entity';
@Entity({ name: 'coa' })
export class Coa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  coa_no: string;

  @Column({ type: 'varchar', default: '', nullable: false })
  sample_id: string;

  @Column({ type: 'varchar', default: '', nullable: false })
  batch_id: string;

  @Column({ nullable: true })
  strain_id: string;

  @ManyToOne(() => Strain, (strain) => strain.id)
  @JoinColumn({ name: 'strain_id', referencedColumnName: 'id' })
  strain: Strain;

  @Column({ nullable: true })
  product_id: string;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @Column({ type: 'varchar', default: '' })
  coa_source: string;

  @Column({ type: 'varchar', default: '' })
  coa_source2: string;

  @Column({ type: 'varchar', default: '' })
  weight: string;

  //summary fields need to be add

  @ManyToOne(() => Summary, (summary) => summary.id)
  @JoinColumn({ name: 'summary', referencedColumnName: 'id' })
  summary: Summary;

  @Column({ type: 'varchar', default: '' })
  total_cannabinoid: string;

  @Column({ type: 'varchar', default: '' })
  total_terpenes: string;

  @Column({ type: 'varchar', default: '' })
  total_THC: string;

  @Column({ type: 'varchar', default: '' })
  total_CBD: string;

  @Column({ type: 'double', default: 0.0 })
  total_cannabinoid_mg: double;

  @Column({ type: 'double', default: 0.0 })
  total_terpenes_mg: double;

  @Column({ type: 'double', default: 0.0 })
  total_THC_mg: double;

  @Column({ type: 'double', default: 0.0 })
  total_CBD_mg: double;

  // cannabinoid_profile field need to be add

  @ManyToOne(() => CannabinoidProfile, (cannabinoid_profile) => cannabinoid_profile.id)
  @JoinColumn({ name: 'cannabinoid_profile', referencedColumnName: 'id' })
  cannabinoid_profile: CannabinoidProfile;

  // terpenes field need to be add

  @ManyToOne(() => Terpenes, (terpenes) => terpenes.id)
  @JoinColumn({ name: 'terpenes', referencedColumnName: 'id' })
  terpenes: Terpenes;

  // pesticides field need to be add

  @ManyToOne(() => Pesticides, (pesticides) => pesticides.id)
  @JoinColumn({ name: 'pesticides', referencedColumnName: 'id' })
  pesticides: Pesticides;

  // microbials field need to be add

  @ManyToOne(() => Microbials, (microbials) => microbials.id)
  @JoinColumn({ name: 'microbials', referencedColumnName: 'id' })
  microbials: Microbials;

  // mycotoxins field need to be add

  @ManyToOne(() => Mycotoxins, (mycotoxins) => mycotoxins.id)
  @JoinColumn({ name: 'mycotoxins', referencedColumnName: 'id' })
  mycotoxins: Mycotoxins;

  // heavy_metals field need to be add

  @ManyToOne(() => HeavyMetals, (heavy_metals) => heavy_metals.id)
  @JoinColumn({ name: 'heavy_metals', referencedColumnName: 'id' })
  heavy_metals: HeavyMetals;

  @Column()
  tested_at: Date;

  @Column({ type: 'varchar', default: '' })
  positive_test_report_text: string;

  @Column({ type: 'varchar', default: '' })
  negative_test_report_text: string;

  @Column({ type: 'varchar', default: '' })
  producer_name: string;

  @Column({ type: 'varchar', default: '' })
  producer_lic: string;

  @Column({ type: 'varchar', default: '' })
  distributor_name: string;

  @Column({ type: 'varchar', default: '' })
  distributor_lic: string;

  @Column({ type: 'varchar', default: '' })
  laboratory_name: string;

  @ManyToOne(() => User, (updated_by) => updated_by.id)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updated_by: User;

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

  @Column({ type: 'boolean', default: 0 })
  is_deleted: boolean;

  @Column({ type: 'boolean', default: 0 })
  is_active: boolean;
}
