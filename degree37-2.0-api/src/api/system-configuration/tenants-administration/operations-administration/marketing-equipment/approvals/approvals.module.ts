import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalsController } from './controller/approvals.controller';
import { ApprovalsService } from './services/approvals.services';
import { Approval } from './entity/approvals.entity';
import { AprovalsHistory } from './entity/approvals-history.entity';

import { AuthMiddleware } from 'src/api/middlewares/auth';
import { User } from '../../../user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Approval, AprovalsHistory, Permissions]),
  ],
  controllers: [ApprovalsController],
  providers: [ApprovalsService, JwtService],
  exports: [ApprovalsService],
})
// export class ApprovalsModule {}
export class ApprovalsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/marketing-equipment/approvals',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/approvals',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/approvals',
        method: RequestMethod.PUT,
      }
    );
  }
}
