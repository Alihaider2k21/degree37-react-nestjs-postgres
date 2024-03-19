import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionalItemController } from './controller/promotional-item.controller';
import { PromotionalItemService } from './services/promotional-item.service';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { PromotionalItems } from './entities/promotional-item.entity';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { PromotionalItemsHistory } from './entities/promotional-item-history.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { PromotionalItemCollectionOperationHistory } from './entities/promotional-item-collection-operations-history.entity';
import { PromotionalItemCollectionOperation } from './entities/promotional-item-collection-operations.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { PromotionalItemsRetirement } from './cron/promotional-items-retirement.cron';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BusinessUnits,
      PromotionalItems,
      PromotionalItemsHistory,
      PromotionalItemCollectionOperation,
      PromotionalItemCollectionOperationHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [PromotionalItemController],
  providers: [PromotionalItemService, JwtService, PromotionalItemsRetirement],
  exports: [PromotionalItemService],
})
export class PromotionalItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/marketing-equipment/promotional-items/search',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/promotional-items',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/promotional-items/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/marketing-equipment/promotional-items/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/promotional-items/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/marketing-equipment/promotional-items',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/promotional-items/drives/byCollectionOperation',
        method: RequestMethod.GET,
      }
    );
  }
}
