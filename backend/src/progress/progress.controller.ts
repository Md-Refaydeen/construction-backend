import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    create(@Body() body: any, @UploadedFile() file: any) {
        if (file) {
            body.image_url = `/uploads/${file.filename}`;
        }
        return this.progressService.create(body);
    }

    @Get()
    findAllRecent() {
        return this.progressService.findAllRecent();
    }

    @Get(':siteId')
    findBySite(@Param('siteId') siteId: string) {
        return this.progressService.findBySite(siteId);
    }
}
