import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketingMaterialController } from './controller/marketing-material.controller';
import { MarketingMaterialService } from './services/marketing-material.service';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { MarketingMaterials } from './entities/marketing-material.entity';
import { AuthMiddleware } from '../../../../../../api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { MarketingMaterialsHistory } from './entities/marketing-material-history.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { MarketingMaterialRetirement } from './cron/marketing-material-retirement.cron';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BusinessUnits,
      MarketingMaterials,
      MarketingMaterialsHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [MarketingMaterialController],
  providers: [
    MarketingMaterialService,
    JwtService,
    MarketingMaterialRetirement,
  ],
  exports: [MarketingMaterialService],
})
export class MarketingMaterialModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/marketing-equipment/marketing-material',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/marketing-material',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/marketing-material/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/marketing-material/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/marketing-equipment/marketing-material/archive/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/marketing-equipment/marketing-material/drives/byCollectionOperation',
        method: RequestMethod.GET,
      }
    );
  }
}
