import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../../crm-administration/common/entity/category.entity';
import { CategoryHistory } from '../../../crm-administration/common/entity/categoryhistory.entity';
import { NceSubCategoryController } from './controller/nce-subcategory.controller';
import { NceSubCategoryService } from './services/nce-subcategory.service';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [NceSubCategoryController],
  providers: [NceSubCategoryService, JwtService],
  exports: [NceSubCategoryService],
})
export class NceSubCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'nce-subcategory',
        method: RequestMethod.POST,
      },
      {
        path: 'nce-subcategory/get-all',
        method: RequestMethod.GET,
      },
      {
        path: 'nce-subcategory',
        method: RequestMethod.GET,
      },
      {
        path: 'nce-subcategory/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'nce-subcategory/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'nce-subcategory/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
