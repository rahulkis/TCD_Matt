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
import { double } from 'aws-sdk/clients/lightsail';

@Entity({ name: 'terpenes' })
export class Terpenes {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Composition, (composition) => composition.id)
  @JoinColumn({ name: 'compo_id', referencedColumnName: 'id' })
  compo_id: Composition;

  @Column({ type: 'varchar', nullable: true })
  LOD: string;

  @Column({ type: 'varchar', nullable: true })
  LOQ: string;

  @Column({ type: 'varchar', nullable: true })
  weight: string;

  @Column({ type: 'double', default: 0.0 })
  weight_mg: double;

  @Column({ type: 'date'})
  tested_date: Date;

  @Column({ type: 'varchar', nullable: true })
  notes: string;

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