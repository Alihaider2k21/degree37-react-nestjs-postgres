import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { ContactPreferences } from './entities/contact-preferences';
import { ContactPreferencesHistory } from './entities/contact-preferences-history';
import { ContactPreferenceController } from './controller/contact-preference.controller';
import { ContactPreferenceService } from './service/contact-preference.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ContactPreferences,
      ContactPreferencesHistory,
      Permissions,
    ]),
  ],
  controllers: [ContactPreferenceController],
  providers: [ContactPreferenceService, JwtService],
  exports: [ContactPreferenceService],
})
export class ContactPreferencesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/contact-preferences', method: RequestMethod.POST },
        { path: '/contact-preferences', method: RequestMethod.GET },
        { path: '/contact-preferences/:id', method: RequestMethod.PUT }
      );
  }
}
