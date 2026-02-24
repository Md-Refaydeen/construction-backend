import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Site } from './site.entity';

@Entity('progress_updates')
export class ProgressUpdate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    site_id: string;

    @ManyToOne(() => Site, (site) => site.progress_updates, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @Column('text')
    description: string;

    @Column('float')
    progress_percentage: number;

    @Column({ default: false })
    delay_flag: boolean;

    @Column({ nullable: true })
    image_url: string;

    @CreateDateColumn()
    created_at: Date;
}
