import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany
} from 'typeorm';

import { User } from './user.entity'

@Entity({ name: 'product-types' })
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // parent_id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'ProductType'
  // },


  @ManyToMany(type => ProductType)
  @JoinTable()
  parent_id: ProductType;

  @Column({ default: 2 })
  type: number;

  @Column({ default: 1 })
  display_order: number;

  @ManyToOne(() => User, (user) => user.id)
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

  @Column({ default: 1 })
  is_active: number;

  @Column({ default: 0 })
  is_deleted: number;
}
