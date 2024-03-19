import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.services';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/api/system-configuration/tenants-administration/user-administration/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60min' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
