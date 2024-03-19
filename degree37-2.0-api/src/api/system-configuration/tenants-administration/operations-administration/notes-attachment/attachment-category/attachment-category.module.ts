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
import { Category } from '../../../crm-administration/common/entity/category.entity';
import { CategoryHistory } from '../../../crm-administration/common/entity/categoryhistory.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [AttachmentCategoryController],
  providers: [AttachmentCategoryService, JwtService],
})
export class NotesAttachmentCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/notes-attachments/attachment-categories',
        method: RequestMethod.GET,
      },
      {
        path: '/notes-attachments/attachment-categories',
        method: RequestMethod.POST,
      },
      {
        path: '/notes-attachments/attachment-categories/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/notes-attachments/attachment-categories/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/notes-attachments/attachment-categories/:id',
        method: RequestMethod.PUT,
      }
    );
  }
}
