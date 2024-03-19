import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AttachmentCategoryService } from './service/attachment-category.service';
import { AttachmentCategoryController } from './controller/attachment-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../common/entity/category.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { CategoryHistory } from '../../common/entity/categoryhistory.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [AttachmentCategoryController],
  providers: [AttachmentCategoryService, JwtService],
})
export class LocationsAttachmentCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/locations/attachment-category', method: RequestMethod.GET },
      { path: '/locations/attachment-category', method: RequestMethod.POST },
      {
        path: '/locations/attachment-category/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/locations/attachment-category/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/locations/attachment-category/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
