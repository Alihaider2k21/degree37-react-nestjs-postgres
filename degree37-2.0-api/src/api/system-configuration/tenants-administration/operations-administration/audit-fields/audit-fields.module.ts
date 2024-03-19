import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user-administration/user/entity/user.entity';
import { AuditFields } from './entities/audit-fields.entity';
import { AuditFieldController } from './controller/audit-field.controller';
import { AuditFieldsService } from './services/audit-field.service';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuditFields, Permissions])],
  controllers: [AuditFieldController],
  providers: [AuditFieldsService, JwtService],
  exports: [AuditFieldsService],
})
export class AuditFieldsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/booking-drive/audit-fields',
      method: RequestMethod.GET,
    });
  }
}
