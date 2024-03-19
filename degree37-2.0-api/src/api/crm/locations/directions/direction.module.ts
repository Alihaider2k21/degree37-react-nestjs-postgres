import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { DirectionsService } from './services/direction.service';
import { DirectionsController } from './controller/direction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directions } from './entities/direction.entity';
import { AuthMiddleware } from '../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { DirectionsHistory } from './entities/direction-history.entity';
import { CrmLocations } from '../entities/crm-locations.entity';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facility,
      Directions,
      DirectionsHistory,
      BusinessUnits,
      User,
      Tenant,
      CrmLocations,
      OrganizationalLevels,
      Address,
      Permissions,
    ]),
  ],
  providers: [DirectionsService, JwtService],
  controllers: [DirectionsController],
  exports: [DirectionsService],
})
export class DirectionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/location/direction', method: RequestMethod.POST },
      { path: '/location/direction', method: RequestMethod.GET },
      {
        path: '/location/direction/collection_operations/list',
        method: RequestMethod.GET,
      },
      {
        path: '/location/direction/:id',
        method: RequestMethod.GET,
      },
      { path: '/location/direction/:id', method: RequestMethod.PUT },
      { path: '/location/direction/archive/:id', method: RequestMethod.PATCH }
    );
  }
}
