import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Composition } from './composition.entity';

@Entity({ name: 'heavy_metals' })
export class HeavyMetals {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Composition, (composition) => composition.id)
  @JoinColumn({ name: 'composition_id', referencedColumnName: 'id' })
  composition_id: Composition;

  @Column({ type: 'varchar' })
  weight: string;

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