import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdsService } from './services/ads.service';
import { AdsController } from './controller/ads.controller';
import { Ads } from './entities/ads.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AdsHistory } from './entities/ads-history.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ads, User, AdsHistory, Tenant, Permissions]),
  ],
  controllers: [AdsController],
  providers: [AdsService, JwtService],
  exports: [AdsService],
})
export class AdsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/ad', method: RequestMethod.GET },
        { path: '/ad', method: RequestMethod.POST },
        { path: '/ad', method: RequestMethod.PUT },
        { path: '/ad/archive/:id', method: RequestMethod.PUT },
        { path: '/ad/:id', method: RequestMethod.GET },
        { path: '/ad/:id', method: RequestMethod.DELETE },
        { path: '/ad/:id/:flag', method: RequestMethod.GET }
      );
  }
}
