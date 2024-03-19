import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Category } from '../../../../system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AttachmentsService } from './services/attachment.service';
import { CrmAttachments } from './entities/attachment.entity';
import { CrmAttachmentsHistory } from './entities/attachment-history.entity';
import { AttachmentController } from './controller/attachment.controller';
import { AttachmentsFiles } from './entities/attachment-files.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      User,
      Tenant,
      CrmAttachments,
      CrmAttachmentsHistory,
      AttachmentsFiles,
      Permissions,
    ]),
  ],
  providers: [AttachmentsService, JwtService],
  controllers: [AttachmentController],
  exports: [AttachmentsService],
})
export class AttachmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/documents/attachments',
        method: RequestMethod.POST,
      },
      {
        path: '/documents/attachments',
        method: RequestMethod.GET,
      },
      {
        path: '/documents/attachments/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/documents/attachments/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/documents/attachments/archive/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
