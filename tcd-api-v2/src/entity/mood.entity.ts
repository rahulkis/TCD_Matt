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

@Entity({ name: 'moods' })
export class Moods {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ default: 0 })
    display_order: number;

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