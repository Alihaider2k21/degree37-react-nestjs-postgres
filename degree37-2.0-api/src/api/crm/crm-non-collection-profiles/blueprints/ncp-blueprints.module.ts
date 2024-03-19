import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { NCPBluePrintsController } from './controller/ncp-blueprints.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { NCPBluePrintsService } from './services/ncp-blueprints.service';
import { CrmNonCollectionProfiles } from '../entities/crm-non-collection-profiles.entity';
import { ShiftsDevices } from 'src/api/shifts/entities/shifts-devices.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { ShiftsRoles } from './entities/shifts-roles.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { CrmNcpBluePrints } from './entities/ncp-blueprints.entity';
import { CrmNcpBluePrintsHistory } from './entities/ncp-blueprints-history.entity';
import { CrmLocations } from '../../locations/entities/crm-locations.entity';
import { ShiftsHistory } from 'src/api/shifts/entities/shifts-history.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Shifts,
      ShiftsHistory,
      ShiftsDevices,
      ShiftsVehicles,
      ShiftsRoles,
      CrmNonCollectionProfiles,
      CrmNcpBluePrints,
      CrmNcpBluePrintsHistory,
      CrmLocations,
      Device,
      Vehicle,
      ContactsRoles,
      Permissions,
    ]),
  ],
  controllers: [NCPBluePrintsController],
  providers: [NCPBluePrintsService, JwtService],
  exports: [NCPBluePrintsService],
})
export class NCPBluePrintsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/non-collection-profiles/:id/blueprints',
        method: RequestMethod.POST,
      },
      {
        path: '/non-collection-profiles/collection-operation/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/non-collection-profiles/:id/blueprints',
        method: RequestMethod.GET,
      },
      {
        path: '/non-collection-profiles/blueprints/:id/about',
        method: RequestMethod.GET,
      },
      {
        path: '/non-collection-profiles/blueprints/:id/shift-details',
        method: RequestMethod.GET,
      },
      {
        path: '/non-collection-profiles/blueprints/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/non-collection-profiles/blueprints/archive/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/non-collection-profiles/blueprints/default/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
