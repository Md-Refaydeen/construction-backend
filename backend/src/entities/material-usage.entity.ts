import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Site } from './site.entity';
import { Material } from './material.entity';

@Entity('material_usages')
export class MaterialUsage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    material_id: string;

    @ManyToOne(() => Material, undefined, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @Column('uuid')
    site_id: string;

    @ManyToOne(() => Site, (site) => site.material_usages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @Column('float')
    quantity_used: number;

    @CreateDateColumn()
    created_at: Date;
}
