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
import { User } from './user.entity';

@Entity({ name: 'settingsmyentourage' })
export class SettingsMyEntourage {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    entourage_name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false })
    image: string;

    @Column({ nullable: false })
    max_selection: string;

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

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    created_by: User;

    @Column({ default: 1 })
    is_active: number;

    @Column({ default: 0 })
    is_deleted: number;
}  