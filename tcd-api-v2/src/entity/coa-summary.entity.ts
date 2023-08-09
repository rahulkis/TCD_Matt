import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'summary' })
export class Summary {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', default: '' })
  test: string;

  @Column({ type: 'date'})
  tested_at: Date;

  @Column({ type: 'varchar', default: '' })
  result: string;

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