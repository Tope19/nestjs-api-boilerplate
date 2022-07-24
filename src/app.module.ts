import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ApiModule } from './api/api.module';
import { PricingModule } from './pricing/pricing.module';
import { OrganisationModule } from './organisation/organisation.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProfileModule } from './profile/profile.module';
import { AppDataSource } from 'ormconfig';
import { PriceGroup } from './entities/price-group.entity';
// import { DatabaseModule } from './databaseModule/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    CategoriesModule,
    OrganisationModule,
    EndpointsModule,
    SubscriptionModule,
    ProfileModule,
    PricingModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
