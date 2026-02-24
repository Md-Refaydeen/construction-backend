import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('materials')
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() body: any) {
        return this.materialsService.create(body);
    }

    @Get()
    findAll() {
        return this.materialsService.findAll();
    }

    @Roles(UserRole.ADMIN)
    @Post('usage')
    logUsage(@Body() body: any) {
        return this.materialsService.logUsage(body);
    }
}
