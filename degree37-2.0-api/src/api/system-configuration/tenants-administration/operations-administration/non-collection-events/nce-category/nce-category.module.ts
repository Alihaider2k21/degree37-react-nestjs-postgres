import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../../crm-administration/common/entity/category.entity';
import { CategoryHistory } from '../../../crm-administration/common/entity/categoryhistory.entity';
import { NceCategoryController } from './controller/nce-category.controller';
import { NceCategoryService } from './services/nce-category.service';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [NceCategoryController],
  providers: [NceCategoryService, JwtService],
  exports: [NceCategoryService],
})
export class NceCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/nce-category', method: RequestMethod.POST },
        { path: '/nce-category/get-all', method: RequestMethod.GET },
        { path: '/nce-category', method: RequestMethod.GET },
        { path: '/nce-category/:id', method: RequestMethod.GET },
        { path: '/nce-category/:id', method: RequestMethod.PUT },
        { path: '/nce-category/:id', method: RequestMethod.PATCH }
      );
  }
}
