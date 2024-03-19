import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { EmailTemplateService } from './services/email-template.service';
import { EmailTemplateController } from './controller/email-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { TemplatesModule } from '../templates/templates.module';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailTemplateHistory } from './entities/email-template-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailTemplate,
      EmailTemplateHistory,
      Permissions,
      User,
    ]),
    TemplatesModule,
  ],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService, JwtService],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'admin/email-template', method: RequestMethod.POST },
        { path: 'admin/email-template', method: RequestMethod.GET },
        { path: 'admin/email-template/:id', method: RequestMethod.GET },
        { path: 'admin/email-template/:id', method: RequestMethod.PUT },
        { path: 'admin/email-template/:id', method: RequestMethod.DELETE }
      );
  }
}
