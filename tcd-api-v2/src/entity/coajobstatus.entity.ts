import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'coajobstatus' })
export class CoaJobStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  job_id: string;

  @Column({ type: 'varchar', nullable: false })
  filename: string;

  @Column({ type: 'varchar', nullable: false })
  originalFilename: string;

  // parsedCoa:[{}],  need to be add this field

  // coatestlabs:{                                need to be add this field later
  //   type:mongoose.Schema.Types.ObjectId,
  //   required:false,
  //   ref: 'coaTestLabs'
  // },

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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  completed_date: Date;

  @Column({ type: 'varchar', nullable: true })
  job_status: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  created_by: User;

  @Column({ type: 'boolean', default: 0 })
  is_deleted: boolean;
}  