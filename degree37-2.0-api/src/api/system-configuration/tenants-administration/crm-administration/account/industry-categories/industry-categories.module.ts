import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { IndustryCategoriesController } from './controller/industry-categories.controller';
import { IndustryCategoriesService } from './service/industry-categories.service';
import { IndustryCategories } from './entities/industry-categories.entity';
import { IndustryCategoriesHistory } from './entities/industry-categories-history.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      IndustryCategories,
      IndustryCategoriesHistory,
      Permissions,
    ]),
  ],
  controllers: [IndustryCategoriesController],
  providers: [IndustryCategoriesService, JwtService],
  exports: [IndustryCategoriesService],
})
export class IndustryCategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/accounts/industry_categories', method: RequestMethod.POST },
      { path: '/accounts/industry_categories', method: RequestMethod.GET },
      {
        path: '/accounts/industry_categories/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/accounts/industry_categories/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/accounts/industry_categories/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/industry-subcategories/parent/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
