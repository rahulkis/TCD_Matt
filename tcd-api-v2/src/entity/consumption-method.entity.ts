import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { MeasurementScales } from './measurementscales.entity';
import { MeasurementUnits } from './measurementunits.entity';

@Entity({ name: 'consumptionmethod' })
export class ConsumptionMethod {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: '' })
  icon: string;

  @Column({ default: 1 })
  type: number;

  @Column({nullable:true})
  parent_method_id: string;

  @ManyToOne(() => ConsumptionMethod, (consumption) => consumption.id)
  @JoinColumn({ name: 'parent_method_id', referencedColumnName: 'id' })
  parent_method: ConsumptionMethod;
  
  @ManyToOne(() => MeasurementUnits, (consumption) => consumption.id)
  @JoinColumn({ name: 'measurement_units', referencedColumnName: 'id' })
  measurement_units: MeasurementUnits[];

  @ManyToOne(() => MeasurementScales, (consumption) => consumption.id)
  @JoinColumn({ name: 'measurement_scales', referencedColumnName: 'id' })
  measurement_scales: MeasurementScales[];

  @Column({ default: '' })
  measurement_unit: string;

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
    onUpdate: "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  updated_at: Date;
}
