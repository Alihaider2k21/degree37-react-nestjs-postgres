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
import { DonorCenterCodes } from '../entities/donor-center-codes.entity';
import { DonorCenterCodesHistory } from '../entities/donor-center-codes-history.entity';
import { DonorCenterCodesController } from './controller/donor-center-codes.controller';
import { DonorCenterCodesService } from './services/donor-center-codes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      DonorCenterCodes,
      DonorCenterCodesHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [DonorCenterCodesController],
  providers: [
    DonorCenterCodesService,
    JwtService,
    CommonFunction,
    AddressService,
    ContactsService,
  ],
  exports: [DonorCenterCodesService, AddressService, ContactsService],
})
export class DonorCenterCodesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/contacts/donors/center_codes', method: RequestMethod.POST },
      { path: '/contacts/donors/center_codes/:id', method: RequestMethod.GET },
      { path: '/contacts/donors/center_codes/', method: RequestMethod.GET },

      {
        path: '/contacts/donors/center_codes/:center_code_id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
