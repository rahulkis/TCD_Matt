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
import { User } from './user.entity';
import { Diary } from './diary.entity';

@Entity({ name: 'cannabinoid_profile' })
export class CannabinoidProfile {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false })
  entry_id: string;

  @ManyToOne(() => Diary, (diary) => diary.id)
  @JoinColumn({ name: 'entry_id', referencedColumnName: 'id' })
  diary: Diary;

  @Column({ nullable: false })
  composition_id: string;

  @ManyToOne(() => Composition, (composition) => composition.id)
  @JoinColumn({ name: 'composition_id', referencedColumnName: 'id' })
  composition: Composition;

  @Column({ type: 'varchar', nullable: true })
  weight: number;

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