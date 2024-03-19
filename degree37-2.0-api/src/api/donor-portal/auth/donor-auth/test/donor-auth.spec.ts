import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DonorAuthController } from '../controller/donor-auth.controller';
import { DonorController } from '../../../donor/controller/donor.controller';
import { DonorService } from '../../../donor/services/donor.service';
import { DonorAuthService } from '../service/donor-auth.service';

dotenv.config();
describe('DonorAuthController', () => {
  let donorAuthController: DonorAuthController;
  let donorController: DonorController;
  let donorAuthService: DonorAuthService;
  let donorService: DonorService;
  beforeEach(async () => {
    const mockDonorService = {
      findDonorByEmail: jest
        .fn()
        .mockImplementation((email: string, password: string) => {
          if (email === 'user@example.com' && password === 'password') {
            return { email, password };
          } else {
            return null;
          }
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [DonorAuthController, DonorController],
      providers: [
        DonorAuthService,
        { provide: DonorService, useValue: mockDonorService },
      ],
    }).compile();

    donorService = module.get<DonorService>(DonorService);
    donorAuthService = module.get<DonorAuthService>(DonorAuthService);
    donorAuthController = module.get<DonorAuthController>(DonorAuthController);
    donorController = module.get<DonorController>(DonorController);
  });

  describe('login', () => {
    it('should return a valid token in the response when given valid credentials', async () => {
      const credentials = { email: 'user@example.com', password: 'password' };
      const mockUser: any = {
        firstName: 'John',
        lastName: 'Doe',
        email: credentials.email,
        password: 'hashedPassword', // Replace with the actual hashed password
        isActive: true,
        forbidUnknownValues: true,
      };

      jest.spyOn(donorService, 'findDonorByEmail').mockResolvedValue(mockUser);

      const result = await donorAuthController.login(credentials);
      if (result?.data?.accessToken) {
        const decoded = jwt.verify(
          result.data.accessToken,
          process.env.JWT_SECRET
        ) as { email: string; id: number };

        expect(decoded.email).toEqual(credentials.email);
        expect(decoded.id).toEqual(mockUser.id);
      }
    });
  });
});
