import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material } from '../entities/material.entity';
import { MaterialUsage } from '../entities/material-usage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Material, MaterialUsage])],
    providers: [MaterialsService],
    controllers: [MaterialsController],
    exports: [MaterialsService]
})
export class MaterialsModule { }
