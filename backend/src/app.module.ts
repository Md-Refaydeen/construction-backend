import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SitesModule } from './sites/sites.module';
import { ProgressModule } from './progress/progress.module';
import { MaterialsModule } from './materials/materials.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { User } from './entities/user.entity';
import { Site } from './entities/site.entity';
import { ProgressUpdate } from './entities/progress.entity';
import { Material } from './entities/material.entity';
import { MaterialUsage } from './entities/material-usage.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Site, ProgressUpdate, Material, MaterialUsage],
      synchronize: true, // Auto-create schema for demo purposes
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false, // Required for Supabase cloud hosting
        },
      },
    }),
    AuthModule,
    UsersModule,
    SitesModule,
    ProgressModule,
    MaterialsModule,
    DashboardModule,
  ],
})
export class AppModule { }
