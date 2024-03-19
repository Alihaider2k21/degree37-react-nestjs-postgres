import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { FilterCriteria } from './entities/filter_criteria';
import { FilterSaved } from './entities/filter_saved';
import { FilterSavedCriteria } from './entities/filter_saved_criteria';
import { FilterController } from './controller/filterController';
import { FilterService } from './services/filterServices';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      FilterCriteria,
      FilterSaved,
      FilterSavedCriteria,
      Permissions,
    ]),
  ],
  controllers: [FilterController],
  providers: [FilterService, JwtService],
})
export class FilterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/filters',
        method: RequestMethod.POST,
      },
      {
        path: '/filters/:code',
        method: RequestMethod.GET,
      },
      {
        path: '/filters/single/:code',
        method: RequestMethod.GET,
      },
      {
        path: '/filters/single-filters/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/filters/delete/:id/:code',
        method: RequestMethod.POST,
      }

      //   {
      //     path: "/staff-leave/list",
      //     method: RequestMethod.GET,
      //   },
      //   {
      //     path: "/staff-leave/:id/find",
      //     method: RequestMethod.GET,
      //   },
      //   {
      //     path: "/staff-leave/:id/archive",
      //     method: RequestMethod.PATCH,
      //   },
      //   {
      //     path: "/staff-leave/:id/edit",
      //     method: RequestMethod.PUT,
      //   }
    );
  }
}
