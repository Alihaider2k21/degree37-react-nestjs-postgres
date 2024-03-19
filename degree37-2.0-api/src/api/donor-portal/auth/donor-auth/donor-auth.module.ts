import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/api/common/auth/jwt.strategy';
import { DonorModule } from '../../donor/donor.module';
import { DonorAuthController } from './controller/donor-auth.controller';
import { DonorAuthService } from './service/donor-auth.service';

@Module({
  providers: [DonorAuthService, JwtStrategy],
  controllers: [DonorAuthController],
  imports: [
    PassportModule,
    DonorModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60min' },
    }),
  ],
})
export class DonorAuthModule {}
