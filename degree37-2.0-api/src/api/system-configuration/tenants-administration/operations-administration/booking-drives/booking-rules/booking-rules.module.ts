import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BookingRules } from './entities/booking-rules.entity';
import { BookingRulesController } from './controller/booking-rules.controller';
import { BookingRulesService } from './services/booking-rules.service';
import { AuditFields } from '../../audit-fields/entities/audit-fields.entity';
import { BookingRulesAddField } from './entities/booking_rules_add_field.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BookingRules,
      AuditFields,
      BookingRulesAddField,
      Permissions,
    ]),
  ],
  controllers: [BookingRulesController],
  providers: [BookingRulesService, JwtService],
  exports: [BookingRulesService],
})
export class BookingRulesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/booking-drive/booking-rule', method: RequestMethod.POST },
        { path: '/booking-drive/booking-rule/:id', method: RequestMethod.GET }
      );
  }
}
