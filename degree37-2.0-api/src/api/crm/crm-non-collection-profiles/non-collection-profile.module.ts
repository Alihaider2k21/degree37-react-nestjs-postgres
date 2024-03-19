import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { NonCollectionProfileController } from './controller/non-collection-profile.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { NonCollectionProfileService } from './services/non-collection-profile.service';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { CrmNonCollectionProfiles } from './entities/crm-non-collection-profiles.entity';
import { CrmNonCollectionProfilesHistory } from './entities/crm-non-collection-profile-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BusinessUnits,
      Tenant,
      Category,
      CrmNonCollectionProfiles,
      CrmNonCollectionProfilesHistory,
      Permissions,
    ]),
  ],
  controllers: [NonCollectionProfileController],
  providers: [NonCollectionProfileService, JwtService],
  exports: [NonCollectionProfileService],
})
export class NonCollectionProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/non-collection-profiles', method: RequestMethod.POST },
      { path: '/non-collection-profiles', method: RequestMethod.GET },
      { path: '/non-collection-profiles/get-all', method: RequestMethod.GET },
      { path: '/non-collection-profiles/:id', method: RequestMethod.GET },
      { path: '/non-collection-profiles/:id', method: RequestMethod.PUT },
      {
        path: '/non-collection-profiles/archive/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
