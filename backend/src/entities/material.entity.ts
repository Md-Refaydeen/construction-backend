import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('materials')
export class Material {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('float')
    total_stock: number;

    @Column('float')
    remaining_stock: number;

    @CreateDateColumn()
    created_at: Date;
}
