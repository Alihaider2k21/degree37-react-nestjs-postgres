import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ProspectsController } from './controller/prospects.controller';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { ProspectsService } from './services/prospects.service';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { Drives } from '../operations/drives/entities/drives.entity';
import { ProspectsBlueprints } from './entities/prospects-blueprints.entity';
import { ProspectsCommunications } from './entities/prospects-communications.entity';
import { Prospects } from './entities/prospects.entity';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Tenant,
      OrganizationalLevels,
      Procedure,
      Products,
      OperationsStatus,
      Permissions,
      Drives,
      ProspectsBlueprints,
      Prospects,
      ProspectsCommunications,
    ]),
    HttpModule,
  ],
  providers: [ProspectsService, JwtService],
  controllers: [ProspectsController],
  exports: [ProspectsService],
})
export class ProspectsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/operations-center/prospects/build-segments',
        method: RequestMethod.GET,
      },
      {
        path: '/operations-center/prospects',
        method: RequestMethod.POST,
      }
    );
  }
}
