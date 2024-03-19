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
import { Category } from '../../../crm-administration/common/entity/category.entity';
import { CategoryHistory } from '../../../crm-administration/common/entity/categoryhistory.entity';
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
export class NotesAttachmentSubCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/notes-attachments/attachment-subcategories',
        method: RequestMethod.GET,
      },
      {
        path: '/notes-attachments/attachment-subcategories',
        method: RequestMethod.POST,
      },
      {
        path: '/notes-attachments/attachment-subcategories/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/notes-attachments/attachment-subcategories/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/notes-attachments/attachment-subcategories/:id',
        method: RequestMethod.PUT,
      }
    );
  }
}
