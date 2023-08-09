import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Activity } from './activities.entity';
import { Composition } from './composition.entity';
import { Diary } from './diary.entity';
import { User } from './user.entity';

@Entity({ name: 'terpenes_profile' })
export class TerpenesProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    entry_id: string;

    @ManyToOne(() => Diary, (diary) => diary.id)
    @JoinColumn({ name: 'entry_id', referencedColumnName: 'id' })
    diary: Diary;

    @Column({ nullable: false })
    composition_id: string;

    @ManyToOne(() => Composition, (Comp) => Comp.id)
    @JoinColumn({ name: 'composition_id', referencedColumnName: 'id' })
    composition: Composition

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
