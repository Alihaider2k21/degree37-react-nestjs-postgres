import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LocationsService } from './services/locations.services';
import { LocationsController } from './controller/locations.controller';
import { CrmLocations } from './entities/crm-locations.entity';
import { CrmLocationsHistory } from './entities/crm-locations-history';
import { Address } from '../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { CrmLocationsSpecs } from './entities/crm-locations-specs.entity';
import { CrmLocationsSpecsHistory } from './entities/crm-locations-specs-history.entity';
import { CrmLocationsSpecsOptions } from './entities/crm-locations-specs-options.entity';
import { CrmLocationsSpecsOptionsHistory } from './entities/crm-locations-specs-options-history.entity';
import { CRMVolunteer } from '../contacts/volunteer/entities/crm-volunteer.entity';
import { RoomSize } from '../../system-configuration/tenants-administration/crm-administration/locations/room-sizes/entity/roomsizes.entity';
import { Directions } from './directions/entities/direction.entity';
import { S3Service } from '../contacts/common/s3.service';
import { ExportService } from '../contacts/common/exportData.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrmLocations,
      User,
      CrmLocationsHistory,
      Address,
      AddressHistory,
      CrmLocationsSpecs,
      CrmLocationsSpecsHistory,
      CrmLocationsSpecsOptions,
      CrmLocationsSpecsOptionsHistory,
      RoomSize,
      CRMVolunteer,
      Directions,
      S3Service,
      ExportService,
      Permissions,
      CustomFields,
    ]),
  ],
  providers: [LocationsService, JwtService, ExportService, S3Service],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class CrmLocationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/crm/locations', method: RequestMethod.GET },
      { path: '/crm/locations/withDirections', method: RequestMethod.GET },
      { path: '/crm/locations', method: RequestMethod.POST },
      { path: '/crm/locations/:id', method: RequestMethod.PATCH },
      { path: '/crm/locations/:id', method: RequestMethod.GET },
      { path: '/crm/locations/archive/:id', method: RequestMethod.PATCH },
      {
        path: '/crm/locations/:id/drives-history',
        method: RequestMethod.GET,
      },
      {
        path: '/crm/locations/:id/drives-history/kpi',
        method: RequestMethod.GET,
      },
      {
        path: '/crm/locations/:id/drives-history/details/:driveId',
        method: RequestMethod.GET,
      }
      //   { path: "/crm/locations/filters", method: RequestMethod.POST }
      // { path: '/accounts/:id', method: RequestMethod.GET },
      // { path: '/accounts/:id', method: RequestMethod.PUT },
      // { path: '/accounts/:id', method: RequestMethod.DELETE }
    );
  }
}
