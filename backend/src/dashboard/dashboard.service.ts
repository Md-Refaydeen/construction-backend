import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../entities/site.entity';
import { ProgressUpdate } from '../entities/progress.entity';
import { MaterialUsage } from '../entities/material-usage.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Site) private siteRepo: Repository<Site>,
        @InjectRepository(ProgressUpdate) private progressRepo: Repository<ProgressUpdate>,
        @InjectRepository(MaterialUsage) private usageRepo: Repository<MaterialUsage>,
    ) { }

    async getOverview() {
        const totalSites = await this.siteRepo.count();

        const delayedProgress = await this.progressRepo.find({ where: { delay_flag: true } });
        const delayedSiteIds = new Set(delayedProgress.map(p => p.site_id));
        const delayedSitesCount = delayedSiteIds.size;

        const usages = await this.usageRepo.find({ relations: ['material'] });
        const materialSummary: Record<string, number> = {};
        usages.forEach(u => {
            const name = u.material?.name || 'Unknown';
            materialSummary[name] = (materialSummary[name] || 0) + u.quantity_used;
        });

        return {
            totalSites,
            delayedSitesCount,
            materialSummary: Object.entries(materialSummary).map(([name, used]) => ({ name, used }))
        };
    }
}
