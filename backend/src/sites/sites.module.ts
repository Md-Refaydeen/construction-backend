import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { Site } from '../entities/site.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Site])],
    providers: [SitesService],
    controllers: [SitesController],
    exports: [SitesService],
})
export class SitesModule { }
