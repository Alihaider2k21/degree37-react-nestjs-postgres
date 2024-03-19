import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserEmailTemplateService } from './services/user-email-template.service';
import { UserEmailTemplateController } from './controller/user-email-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from '../../../../../admin/email-template/entities/email-template.entity';
import { TemplatesModule } from '../../../../../admin/templates/templates.module';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailTemplateHistory } from '../../../../../admin/email-template/entities/email-template-history.entity';
import { Address } from '../../../../platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from '../../../../platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { Contacts } from '../../../../../crm/contacts/common/entities/contacts.entity';
import { ContactsHistory } from '../../../../../crm/contacts/common/entities/contacts-history.entity';
import { DonorGroupCodes } from '../../../../../crm/contacts/donor/entities/donor-group-codes.entity';
import { DonorGroupCodesHistory } from '../../../../../crm/contacts/donor/entities/donor-group-codes-history.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CommonFunction } from '../../../../../crm/contacts/common/common-functions';
import { AddressService } from '../../../../../crm/contacts/common/address.service';
import { ContactsService } from '../../../../../crm/contacts/common/contacts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      Tenant,
      EmailTemplate,
      EmailTemplateHistory,
      Permissions,
      User,
    ]),
    TemplatesModule,
  ],
  controllers: [UserEmailTemplateController],
  providers: [
    UserEmailTemplateService,
    JwtService,
    CommonFunction,
    AddressService,
    ContactsService,
  ],
  exports: [UserEmailTemplateService, AddressService, ContactsService],
})
export class UserEmailTemplateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/email-templates', method: RequestMethod.POST },
        { path: '/email-templates', method: RequestMethod.GET },
        { path: '/email-templates/:id', method: RequestMethod.GET },
        { path: '/email-templates/:id', method: RequestMethod.PUT },
        { path: '/email-templates/:id', method: RequestMethod.PATCH }
      );
  }
}
