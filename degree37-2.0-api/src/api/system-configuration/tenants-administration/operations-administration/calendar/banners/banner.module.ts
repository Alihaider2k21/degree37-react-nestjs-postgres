import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BannerService } from './services/banner.services';
import { BannerController } from './controller/banner.controller';
import { Banner } from './entities/banner.entity';
import { BannerHistory } from './entities/banner-history.entity';

import { BannerCollectionOperation } from './entities/banner-collection-operations.entity';

import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../../../../../api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BannerCollectionOperation,
      Banner,
      User,
      BannerHistory,
      Permissions,
    ]),
  ],
  providers: [BannerService, JwtService],
  controllers: [BannerController],
  exports: [BannerService],
})
export class BannerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/banners', method: RequestMethod.GET },
        { path: '/banners', method: RequestMethod.POST },
        { path: '/banners/:id', method: RequestMethod.GET },
        { path: '/banners/:id', method: RequestMethod.PUT },
        { path: '/banners/:id', method: RequestMethod.DELETE }
      );
  }
}
