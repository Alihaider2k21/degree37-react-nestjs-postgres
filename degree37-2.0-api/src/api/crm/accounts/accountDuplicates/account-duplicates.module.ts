import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AccountsDuplicatesController } from './controller/account-duplicates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Duplicates } from 'src/api/common/entities/duplicates/duplicates.entity';
import { DuplicatesHistory } from 'src/api/common/entities/duplicates/duplicates-history.entity';
import { AccountsDuplicatesService } from './service/account-duplicates.service';
import { Accounts } from '../entities/accounts.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Duplicates,
      DuplicatesHistory,
      Accounts,
      Address,
      Permissions,
    ]),
  ],
  controllers: [AccountsDuplicatesController],
  providers: [AccountsDuplicatesService, JwtService],
})
export class AccountsDuplicatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/accounts/:id/duplicates/create',
        method: RequestMethod.POST,
      },
      { path: '/accounts/:id/duplicates/list', method: RequestMethod.GET },
      { path: '/accounts/:id/duplicates/resolve', method: RequestMethod.PATCH },
      { path: '/accounts/:id/duplicates/identify', method: RequestMethod.GET }
    );
  }
}
