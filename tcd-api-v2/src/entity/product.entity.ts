import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProductType } from './product-type.entity';
import { Diary } from './diary.entity';
import { Strain } from './strain.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: '' })
  description: string;

  @Column({ nullable: false, default: '' })
  weight: string;

  @Column({ nullable: true })
  strain_id: string;

  @ManyToOne(() => Strain, (strain) => strain.id)
  @JoinColumn({ name: 'strain_id', referencedColumnName: 'id' })
  strain: Strain;

  @Column({nullable:true})
  product_type_id: string;

  @ManyToOne(() => ProductType, (productType) => productType.id)
  @JoinColumn({ name: 'product_type_id', referencedColumnName: 'id' })
  product_type: ProductType;

  @Column({ nullable: false, default: '' })
  product_image: string;

  @Column({ nullable: false, default: '' })
  COA_identifier: string;

  @Column({ nullable: false, default: 2 })
  has_identifier: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updated_by: User;

  @Column({ default: 0 })
  is_deleted: boolean;

  @Column({ default: 0 })
  is_active: number;

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

  @OneToMany(() => Diary, (diary) => diary.product)
  diary: Diary[];
}
