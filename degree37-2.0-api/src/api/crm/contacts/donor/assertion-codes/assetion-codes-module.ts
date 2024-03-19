import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { CommonFunction } from '../../common/common-functions';
import { AddressService } from '../../common/address.service';
import { ContactsService } from '../../common/contacts.service';
import { Address } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { Contacts } from '../../common/entities/contacts.entity';
import { ContactsHistory } from '../../common/entities/contacts-history.entity';
import { AssertionCodes } from '../entities/assertion-codes.entity';
import { AssertionCodesHistory } from '../entities/assertion-codes-history.entity';
import { AssertionCodesController } from './controller/assertion-codes.controller';
import { AssertionCodesService } from './services/assertion-codes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      AssertionCodes,
      AssertionCodesHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [AssertionCodesController],
  providers: [
    AssertionCodesService,
    JwtService,
    CommonFunction,
    AddressService,
    ContactsService,
  ],
  exports: [AssertionCodesService, AddressService, ContactsService],
})
export class AssertionCodesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/assertion_codes', method: RequestMethod.POST },
      { path: '/assertion_codes/:id', method: RequestMethod.GET },
      { path: '/assertion_codes/', method: RequestMethod.GET },

      {
        path: '/assertion_codes/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
