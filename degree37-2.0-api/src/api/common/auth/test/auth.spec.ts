// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from '../controllers/auth.controller';
// import { AuthService } from '../services/auth.services';
// import * as jwt from 'jsonwebtoken';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';
// import * as dotenv from 'dotenv';
// import { UserService } from '../../../../api/system-configuration/tenants-administration/user-administration/user/services/user.services';
// import { UserController } from '../../../../api/system-configuration/tenants-administration/user-administration/user/controller/user.controller';

// dotenv.config();
// describe('AuthController', () => {
//   let controller: AuthController;
//   let userController: UserController;
//   let authService: AuthService;
//   let userService: UserService;
//   beforeEach(async () => {
//     const mockUserService = {
//       findByEmail: jest
//         .fn()
//         .mockImplementation((email: string, password: string) => {
//           if (email === 'user@example.com' && password === 'password') {
//             return { email, password };
//           } else {
//             return null;
//           }
//         }),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot(),
//         JwtModule.register({
//           secret: process.env.JWT_SECRET,
//           signOptions: { expiresIn: '60s' },
//         }),
//       ],
//       controllers: [AuthController, UserController],
//       providers: [
//         AuthService,
//         { provide: UserService, useValue: mockUserService },
//       ],
//     }).compile();

//     controller = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//     userController = module.get<UserController>(UserController);
//     userService = module.get<UserService>(UserService);
//   });

//   describe('login', () => {
//     it('should return a valid token in the response when given valid credentials', async () => {
//       const credentials = { email: 'user@example.com', password: 'password' };
//       const mockUser: any = {
//         firstName: 'John',
//         lastName: 'Doe',
//         email: credentials.email,
//         password: 'hashedPassword', // Replace with the actual hashed password
//         isActive: true,
//         forbidUnknownValues: true,
//       };

//       jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

//       const result = await controller.login(credentials);
//       const decoded = jwt.verify(
//         result.access_token,
//         process.env.JWT_SECRET,
//       ) as { email: string; id: number };

//       expect(decoded.email).toEqual(credentials.email);
//       expect(decoded.id).toEqual(mockUser.id);
//     });
//   });
// });

describe('calculateSumFive', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateNumbers(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateNumbers(a: number, b: number): number {
  return a + b;
}
