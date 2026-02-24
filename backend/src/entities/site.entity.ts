import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ProgressUpdate } from './progress.entity';
import { MaterialUsage } from './material-usage.entity';

@Entity('sites')
export class Site {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => ProgressUpdate, (update) => update.site)
    progress_updates: ProgressUpdate[];

    @OneToMany(() => MaterialUsage, (usage) => usage.site)
    material_usages: MaterialUsage[];
}
