import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../entities/material.entity';
import { MaterialUsage } from '../entities/material-usage.entity';

@Injectable()
export class MaterialsService {
    constructor(
        @InjectRepository(Material) private itemsRepo: Repository<Material>,
        @InjectRepository(MaterialUsage) private usageRepo: Repository<MaterialUsage>,
    ) { }

    async create(data: Partial<Material>): Promise<Material> {
        const mat = this.itemsRepo.create({
            ...data,
            remaining_stock: data.total_stock
        });
        return this.itemsRepo.save(mat);
    }

    async findAll(): Promise<any[]> {
        const materials = await this.itemsRepo.find();
        return materials.map(m => ({
            ...m,
            isLowStock: (m.remaining_stock / m.total_stock) < 0.2
        }));
    }

    async logUsage(data: { material_id: string, site_id: string, quantity_used: number }): Promise<MaterialUsage> {
        const material = await this.itemsRepo.findOne({ where: { id: data.material_id } });
        if (!material) throw new NotFoundException('Material not found');

        if (material.remaining_stock < data.quantity_used) {
            throw new BadRequestException('Not enough stock remaining');
        }

        material.remaining_stock -= data.quantity_used;
        await this.itemsRepo.save(material);

        const usage = this.usageRepo.create(data);
        return this.usageRepo.save(usage);
    }
}
