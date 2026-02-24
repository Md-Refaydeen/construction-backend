import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../entities/site.entity';

@Injectable()
export class SitesService {
    constructor(
        @InjectRepository(Site)
        private sitesRepository: Repository<Site>,
    ) { }

    async create(data: Partial<Site>): Promise<Site> {
        const site = this.sitesRepository.create(data);
        return this.sitesRepository.save(site);
    }

    async findAll(): Promise<Site[]> {
        return this.sitesRepository.find();
    }

    async findOne(id: string): Promise<Site> {
        const site = await this.sitesRepository.findOne({ where: { id } });
        if (!site) throw new NotFoundException('Site not found');
        return site;
    }
}
