import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CrmLocationsDuplicatesController } from './controller/location-duplicates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Duplicates } from 'src/api/common/entities/duplicates/duplicates.entity';
import { DuplicatesHistory } from 'src/api/common/entities/duplicates/duplicates-history.entity';
import { CrmLocationsDuplicatesService } from './service/location-duplicates.service';
import { CrmLocations } from '../entities/crm-locations.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Duplicates,
      DuplicatesHistory,
      CrmLocations,
      Address,
      Permissions,
    ]),
  ],
  controllers: [CrmLocationsDuplicatesController],
  providers: [CrmLocationsDuplicatesService, JwtService],
})
export class CrmLocationsDuplicatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/crm/locations/:id/duplicates/create',
        method: RequestMethod.POST,
      },
      { path: '/crm/locations/:id/duplicates/list', method: RequestMethod.GET },
      {
        path: '/crm/locations/:id/duplicates/resolve',
        method: RequestMethod.PATCH,
      },
      {
        path: '/crm/locations/:id/duplicates/identify',
        method: RequestMethod.GET,
      }
    );
  }
}
