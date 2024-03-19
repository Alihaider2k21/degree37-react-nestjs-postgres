import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DonorService } from '../../../donor/services/donor.service';
import { DonorLoginDto } from '../dto/donor-login.dto';

@Injectable()
export class DonorAuthService {
  constructor(
    private readonly donorService: DonorService,
    private jwtService: JwtService
  ) {}

  async validateDonor(email: string, password: string) {
    const donor = await this.donorService.findDonorByEmail(email);
    if (donor && donor.password) {
      const isPasswordValid = await bcrypt.compare(password, donor.password);
      if (!isPasswordValid) {
        return null;
      }
      return donor;
    }
    return null;
  }

  async login(donor: DonorLoginDto) {
    const { email, password } = donor;
    const validatedDonor = await this.validateDonor(email, password);
    if (validatedDonor) {
      const accessToken = this.jwtService.sign({ email, password });
      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Logged in Successfully',
        data: { email, accessToken },
      };
    } else {
      return {
        error: 'invalid credentials',
      };
    }
  }
}
