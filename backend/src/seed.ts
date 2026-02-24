import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { SitesService } from './sites/sites.service';
import { MaterialsService } from './materials/materials.service';
import { ProgressService } from './progress/progress.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const usersService = app.get(UsersService);
    const sitesService = app.get(SitesService);
    const materialsService = app.get(MaterialsService);
    const progressService = app.get(ProgressService);

    console.log('Seeding Demo User...');
    let demoUser = await usersService.findOneByEmail('demo@example.com');
    if (!demoUser) {
        demoUser = await usersService.create({
            name: 'Demo Admin',
            email: 'demo@example.com',
            password: await bcrypt.hash('password123', 10)
        });
    }

    console.log('Seeding Demo Sites...');
    const existingSites = await sitesService.findAll();
    if (existingSites.length === 0) {
        const site1 = await sitesService.create({ name: 'Downtown Commercial Plaza', latitude: 51.505, longitude: -0.09 });
        const site2 = await sitesService.create({ name: 'Riverside Residential Complex', latitude: 51.515, longitude: -0.1 });
        const site3 = await sitesService.create({ name: 'Industrial Park Alpha', latitude: 51.49, longitude: -0.08 });

        console.log('Seeding Demo Materials...');
        await materialsService.create({ name: 'Portland Cement (50kg bags)', total_stock: 5000 });
        const steel = await materialsService.create({ name: 'Steel Rebar (Tons)', total_stock: 250 });

        // Create Low stock condition
        const wood = await materialsService.create({ name: 'Plywood Sheets', total_stock: 1000 });
        await materialsService.logUsage({ material_id: wood.id, site_id: site1.id, quantity_used: 850 });
        await materialsService.logUsage({ material_id: steel.id, site_id: site2.id, quantity_used: 100 });

        console.log('Seeding Demo Progress...');
        await progressService.create({
            site_id: site1.id,
            description: 'Cleared ground and poured foundation for zone A',
            progress_percentage: 15,
            delay_flag: false
        });
        await progressService.create({
            site_id: site2.id,
            description: 'Supply chain issue with specialized steel delivery, halting zone B framing.',
            progress_percentage: 5,
            delay_flag: true
        });
    }

    console.log('Seeding Complete! Login with demo@example.com / password123');
    await app.close();
}
bootstrap();
