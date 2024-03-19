import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RefreshTokenDTO } from '../dto/login.dto';
import { UserService } from '../../../../api/system-configuration/tenants-administration/user-administration/user/services/user.services';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const userData = await this.userService.findDeletedUser(email);
    if (userData) {
      return userData;
    }
    const user = await this.userService.findByEmail(email);
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }
      return user;
    }
    return null;
  }

  async login(user: LoginDto) {
    const data = await this.userService.findByEmail(user?.email);

    const payload = { email: user?.email, id: data?.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshToken(user: RefreshTokenDTO) {
    const userdata: any = await this.userService.findByKCUsername(
      user?.username
    );
    if (!userdata) {
      throw new NotFoundException('User not found');
    }
    const payload = {
      email: userdata?.email,
      id: userdata?.id,
      tenantId: userdata?.tenant?.id,
      super_admin: userdata?.tenant?.has_superadmin,
      permissions: userdata?.permissions,
      modules: userdata?.module,
      applications: userdata?.application,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
