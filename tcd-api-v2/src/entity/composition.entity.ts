import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'composition' })
export class Composition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 150 })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', default: '' })
  image: string;

  @Column({ nullable: false }) // 1 for cannabinoid 2 for terpenes 3 pesticides 4 Microbials 5 Mycotoxins 6 Heavy Metals
  type: number;

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

  @Column({ type: 'boolean', default: 1 })
  is_active: boolean;

  @Column({ type: 'boolean', default: 0 })
  is_deleted: boolean;
}
