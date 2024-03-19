import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AttachmentSubCategoryService } from './service/attachment-subcategory.service';
import { AttachmentSubCategoryController } from './controller/attachment-subcategory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../common/entity/category.entity';
import { CategoryHistory } from '../../common/entity/categoryhistory.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [AttachmentSubCategoryController],
  providers: [AttachmentSubCategoryService, JwtService],
})
export class AccountsAttachmentSubCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/accounts/attachment-subcategory', method: RequestMethod.GET },
      {
        path: '/accounts/attachment-subcategory/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/attachment-subcategory',
        method: RequestMethod.POST,
      },
      {
        path: '/accounts/attachment-subcategory/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/accounts/attachment-subcategory/:id',
        method: RequestMethod.PUT,
      }
    );
  }
}
