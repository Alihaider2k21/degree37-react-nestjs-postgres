import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../common/entity/category.entity';
import { CategoryHistory } from '../../common/entity/categoryhistory.entity';
import { NoteCategoryController } from './controller/note-category.controller';
import { NoteCategoryService } from './services/note-category.service';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [NoteCategoryController],
  providers: [NoteCategoryService, JwtService],
  exports: [NoteCategoryService],
})
export class AccountNoteCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/accounts/note-category', method: RequestMethod.POST },
        { path: '/accounts/note-category', method: RequestMethod.GET },
        { path: '/accounts/note-category/:id', method: RequestMethod.GET },
        { path: '/accounts/note-category/:id', method: RequestMethod.PUT },
        { path: '/accounts/note-category/:id', method: RequestMethod.PATCH }
      );
  }
}
