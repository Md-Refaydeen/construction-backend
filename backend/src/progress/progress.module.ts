import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { ProgressUpdate } from '../entities/progress.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProgressUpdate])],
    providers: [ProgressService],
    controllers: [ProgressController],
    exports: [ProgressService]
})
export class ProgressModule { }
