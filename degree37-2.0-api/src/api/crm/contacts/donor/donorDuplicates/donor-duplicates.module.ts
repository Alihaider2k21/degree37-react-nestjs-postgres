import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DonorDuplicatesController } from './controller/donor-duplicates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Duplicates } from 'src/api/common/entities/duplicates/duplicates.entity';
import { DuplicatesHistory } from 'src/api/common/entities/duplicates/duplicates-history.entity';
import { DonorDuplicatesService } from './service/donor-duplicates.service';
import { Donors } from '../entities/donors.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Duplicates,
      DuplicatesHistory,
      Donors,
      Permissions,
    ]),
  ],
  controllers: [DonorDuplicatesController],
  providers: [DonorDuplicatesService, JwtService],
})
export class DonorDuplicatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/contact-donors/:id/duplicates/create',
        method: RequestMethod.POST,
      },
      {
        path: '/contact-donors/:id/duplicates/list',
        method: RequestMethod.GET,
      },
      {
        path: '/contact-donors/:id/duplicates/resolve',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-donors/duplicates/identify',
        method: RequestMethod.POST,
      }
    );
  }
}
