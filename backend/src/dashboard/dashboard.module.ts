import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Site } from '../entities/site.entity';
import { ProgressUpdate } from '../entities/progress.entity';
import { MaterialUsage } from '../entities/material-usage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Site, ProgressUpdate, MaterialUsage])],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule { }
