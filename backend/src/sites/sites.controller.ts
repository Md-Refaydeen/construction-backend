import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SitesService } from './sites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sites')
export class SitesController {
    constructor(private readonly sitesService: SitesService) { }

    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() body: any) {
        return this.sitesService.create(body);
    }

    @Get()
    findAll() {
        return this.sitesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sitesService.findOne(id);
    }
}
