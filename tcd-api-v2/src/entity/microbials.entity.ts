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

@Entity({ name: 'microbials' })
export class Microbials {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Composition, (composition) => composition.id)
  @JoinColumn({ name: 'composition_id', referencedColumnName: 'id' })
  composition_id: Composition;

  @Column({ type: 'double', default: 0.0 })
  weight: double;

  @Column({ type: 'varchar', default:'' })
  status: string

  @Column({ type: 'date'})
  tested_at: Date;

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