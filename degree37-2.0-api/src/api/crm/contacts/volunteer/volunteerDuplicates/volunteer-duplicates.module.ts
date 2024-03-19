import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { VolunteerDuplicatesController } from './controller/volunteer-duplicates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Duplicates } from 'src/api/common/entities/duplicates/duplicates.entity';
import { DuplicatesHistory } from 'src/api/common/entities/duplicates/duplicates-history.entity';
import { VolunteerDuplicatesService } from './service/volunteer-duplicates.service';
import { CRMVolunteer } from '../entities/crm-volunteer.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Duplicates,
      DuplicatesHistory,
      CRMVolunteer,
      Permissions,
    ]),
  ],
  controllers: [VolunteerDuplicatesController],
  providers: [VolunteerDuplicatesService, JwtService],
})
export class VolunteerDuplicatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/contact-volunteer/:id/duplicates/create',
        method: RequestMethod.POST,
      },
      {
        path: '/contact-volunteer/:id/duplicates/list',
        method: RequestMethod.GET,
      },
      {
        path: '/contact-volunteer/:id/duplicates/resolve',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-volunteer/duplicates/identify',
        method: RequestMethod.POST,
      }
    );
  }
}
