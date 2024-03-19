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
import { DonorsAssertionCodes } from '../entities/donors-assertion-codes.entity';
import { DonorsAssertionCodesHistory } from '../entities/donors_assertion-codes-history.entity';
import { DonorsAssertionCodesController } from './controller/donors-assertion-codes.controller';
import { DonorsAssertionCodesService } from './services/donors-assertion-codes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      DonorsAssertionCodes,
      DonorsAssertionCodesHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [DonorsAssertionCodesController],
  providers: [
    DonorsAssertionCodesService,
    JwtService,
    CommonFunction,
    AddressService,
    ContactsService,
  ],
  exports: [DonorsAssertionCodesService, AddressService, ContactsService],
})
export class DonorsAssertionCodesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/contacts/donors/assertion_codes', method: RequestMethod.POST },
      {
        path: '/contacts/donors/assertion_codes/:donor_id',
        method: RequestMethod.GET,
      },
      {
        path: '/contacts/donors/assertion_codes/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
