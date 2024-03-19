import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from './entities/business-units.entity';
import { BusinessUnitsController } from './controller/business-units.controller';
import { BusinessUnitsService } from './services/business-units.service';
import { OrganizationalLevels } from '../organizational-levels/entities/organizational-level.entity';
import { AuthMiddleware } from '../../../../../../api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from '../../../../../../api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnitsHistory } from './entities/business-units-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessUnits,
      OrganizationalLevels,
      User,
      Tenant,
      BusinessUnitsHistory,
      Permissions,
    ]),
  ],
  controllers: [BusinessUnitsController],
  providers: [BusinessUnitsService, JwtService],
  exports: [BusinessUnitsService],
})
export class BusinessUnitModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/business_units/organizational-level/business-units',
        method: RequestMethod.GET,
      },
      {
        path: '/business_units/collection_operations/list',
        method: RequestMethod.GET,
      },
      { path: '/business_units', method: RequestMethod.GET },
      { path: '/business_units/', method: RequestMethod.GET },
      { path: '/business_units/list', method: RequestMethod.GET },
      { path: '/business_units', method: RequestMethod.POST },
      { path: '/business_units/archive/:id', method: RequestMethod.PUT },
      { path: '/business_units/:id', method: RequestMethod.PUT },
      { path: '/business_units/:id', method: RequestMethod.GET }
    );
  }
}
