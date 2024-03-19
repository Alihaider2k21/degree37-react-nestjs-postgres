import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Donors } from '../entities/donors.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { DonorDonations } from './entities/donor-donations.entity';
import { DonorDonationsHistory } from './entities/donor-donations-history.entity';
import { DonorDonationController } from './controller/donor-donation-history.controller';
import { DonorDonationService } from './services/donor-donation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DonorDonations,
      DonorDonationsHistory,
      Donors,
      Permissions,
    ]),
  ],
  controllers: [DonorDonationController],
  providers: [DonorDonationService, JwtService],
})
export class DonorDonationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/donors/donations/history',
      method: RequestMethod.POST,
    });
  }
}
