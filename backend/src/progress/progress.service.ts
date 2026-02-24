import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgressUpdate } from '../entities/progress.entity';

@Injectable()
export class ProgressService {
    constructor(
        @InjectRepository(ProgressUpdate) private repo: Repository<ProgressUpdate>
    ) { }

    async create(data: Partial<ProgressUpdate>): Promise<ProgressUpdate> {
        const update = this.repo.create(data);
        return this.repo.save(update);
    }

    async findBySite(siteId: string): Promise<ProgressUpdate[]> {
        return this.repo.find({
            where: { site_id: siteId },
            order: { created_at: 'DESC' }
        });
    }

    async findAllRecent(): Promise<ProgressUpdate[]> {
        return this.repo.find({
            relations: ['site'],
            order: { created_at: 'DESC' },
            take: 10
        });
    }
}
