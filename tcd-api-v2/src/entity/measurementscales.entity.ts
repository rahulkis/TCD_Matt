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

@Entity({ name: 'measurementscales' })
export class MeasurementScales {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true, default:'' })
  scale: string;

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

  @Column({ default: 1 })
  is_deleted: number;
}  