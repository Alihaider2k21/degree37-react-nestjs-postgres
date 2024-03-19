import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliationService } from './services/affiliation.services';
import { AffiliationController } from './controller/affiliation.controller';
import { Affiliation } from './entity/affiliation.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { AffiliationHistory } from './entity/affiliationHistory.entity';
import { AuthMiddleware } from '../../../../../../api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Affiliation,
      User,
      BusinessUnits,
      AffiliationHistory,
      Permissions,
    ]),
  ],
  providers: [AffiliationService, JwtService],
  controllers: [AffiliationController],
  exports: [AffiliationService],
})
export class AffiliationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/affiliations', method: RequestMethod.GET },
        { path: '/affiliations/:id', method: RequestMethod.GET },
        { path: '/affiliations', method: RequestMethod.POST },
        { path: '/affiliations', method: RequestMethod.PUT },
        { path: '/affiliations/list', method: RequestMethod.GET },
        { path: '/affiliations/archive/:id', method: RequestMethod.DELETE }
      );
  }
}
