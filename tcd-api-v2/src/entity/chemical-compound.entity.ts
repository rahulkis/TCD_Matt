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
import { Composition } from './composition.entity';
import { Product } from './product.entity';

@Entity({ name: 'chemical_compound' })
export class ChemicalCompound {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  product_id: string;

  @ManyToOne(() => Product, (p) => p.id)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @Column({ nullable: true })
  composition_id: string;

  @ManyToOne(() => Composition, (c) => c.id)
  @JoinColumn({ name: 'composition_id', referencedColumnName: 'id' })
  composition: Composition;

  @Column({ nullable: true })
  composition_value: string;

  @Column({ default: 0 })
  is_deleted: boolean;

  @Column({ default: 0 })
  is_active: boolean;

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
