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
import { DonorGroupCodesService } from './services/donor-group-codes.service';
import { DonorGroupCodes } from '../entities/donor-group-codes.entity';
import { DonorGroupCodesHistory } from '../entities/donor-group-codes-history.entity';
import { DonorGroupCodesController } from './controller/donor-group-codes.controller';
import { CommonFunction } from '../../common/common-functions';
import { AddressService } from '../../common/address.service';
import { ContactsService } from '../../common/contacts.service';
import { Address } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { Contacts } from '../../common/entities/contacts.entity';
import { ContactsHistory } from '../../common/entities/contacts-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      DonorGroupCodes,
      DonorGroupCodesHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [DonorGroupCodesController],
  providers: [
    DonorGroupCodesService,
    JwtService,
    CommonFunction,
    AddressService,
    ContactsService,
  ],
  exports: [DonorGroupCodesService, AddressService, ContactsService],
})
export class DonorGroupCodesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/contacts/donors/group_codes', method: RequestMethod.POST },
      { path: '/contacts/donors/group_codes/:id', method: RequestMethod.GET },
      { path: '/contacts/donors/group_codes/', method: RequestMethod.GET },

      {
        path: '/contacts/donors/group_codes/:group_id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
