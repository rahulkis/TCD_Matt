import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'banneradvertisement' })
export class BannerAdvertisement {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type:'varchar', nullable: false, length: 150 })
  banner_advertisement_title: string;

  @Column({ type:'varchar', nullable: true, default: ''})
  banner_advertisement_image: string;

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

  @Column({ type:'int', default: 1 })
  is_active: number;

  @Column({ type:'int', default: 0 })
  is_deleted: number;

}