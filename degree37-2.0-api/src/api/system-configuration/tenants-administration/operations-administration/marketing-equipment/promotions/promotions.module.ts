import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsController } from './controller/promotions_controller';
import { PromotionsService } from './services/promotions_services';
import { PromotionEntity } from './entity/promotions.entity';
import { PromotionHistory } from './entity/promotions-history.entity';

import { AuthMiddleware } from 'src/api/middlewares/auth';
import { User } from '../../../user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { PromotionsCollectionOperation } from './entity/promotions-collection-operations.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PromotionEntity,
      BusinessUnits,
      PromotionHistory,
      PromotionsCollectionOperation,
      Permissions,
    ]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService, JwtService],
  exports: [PromotionsService],
})
export class PromotionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/marketing-equipment/promotions',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/promotions/:promotionId',
        method: RequestMethod.PUT,
      },
      {
        path: '/marketing-equipment/promotions',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/promotions/search',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/promotions/archive/:promotionId',
        method: RequestMethod.PATCH,
      },
      {
        path: '/marketing-equipment/promotions/drives',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/promotions/:promotionId',
        method: RequestMethod.GET,
      }
    );
  }
}
