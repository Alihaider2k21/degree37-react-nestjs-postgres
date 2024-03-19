// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from '../controller/user.controller';
// import { UserService } from '../services/user.services';
// import { CreateUserDto, SearchUserDto } from '../dto/create-user.dto';
// import { User } from '../entity/user.entity';
// import * as dotenv from 'dotenv';
// dotenv.config();
// describe('UserController', () => {
//   let controller: UserController;
//   let service: UserService;
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         {
//           provide: UserService,
//           useValue: {
//             addUser: jest.fn(),
//             getUser: jest.fn(),
//             deleteUser: jest.fn(),
//             update: jest.fn(),
//             searchUsers: jest.fn(),
//             getUsers: jest.fn()
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<UserController>(UserController);
//     service = module.get<UserService>(UserService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('addUser', () => {
//     const userData:CreateUserDto = {
//       email: 'johndoe@example.com',
//       password: 'password123',
//       first_name: "John",
//       last_name: "Don",
//       unique_identifier:"asdf123",
//       role: BigInt(1),
//       created_by:BigInt(123),
//       forbidUnknownValues:true,
//     };

//     const createdUser: User = {
//       ...userData,
//       id: BigInt(13),
//       is_active: true,
//       is_archived:false,
//       created_at: new Date(),
//       updated_at: new Date(),
//       is_super_admin:false,
//       tenant : BigInt(1),
//       keycloak_username: 'johndoe@example.com'
//     };

//     it('should create a new user', async () => {
//       jest.spyOn(service, 'addUser').mockResolvedValue({
//         status:"success",
//         response: "User Created Successfully",
//         status_code: 201,
//         data: createdUser
//       }
// );  let subdomain = process.env.REALM_NAME
//       const result = await controller.addUser({origin:subdomain},userData);
//       expect(result).toEqual({
//         status:"success",
//         response: "User Created Successfully",
//         status_code: 201,
//         data: createdUser
//       });
//       expect(service.addUser).toHaveBeenCalledWith(userData,subdomain);
//     });
//   });

//   describe('getUser', () => {
//     const userId = BigInt(123);

//     const user = {
//       id: userId,
//       email: 'johndoe@example.com',
//       first_name: 'John',
//       last_name: 'Doe',
//       password: "1234567",
//       is_active: true,
//       created_at: new Date(),
//       updated_at: new Date(),
//       role: BigInt(1),
//       is_archived:false,
//       created_by:BigInt(123),
//       is_super_admin:false,
//       tenant : BigInt(1),
//       keycloak_username: 'johndoe@example.com'
//     };

//     it('should get a user by id', async () => {
//       jest.spyOn(service, 'getUser').mockResolvedValue(user);

//       const result = await controller.getUser(userId);
//       expect(result).toEqual(user);
//       expect(service.getUser).toHaveBeenCalledWith(userId);
//     });
//   });

//   describe('deleteUser', () => {

//     const userId = BigInt(123);
//     const updatedId = BigInt(123);
//     const deletedUser = {
//       "status": "success",
//       "response": "User Archived.",
//       "status_code": 204
//      };
//     let subdomain = process.env.REALM_NAME

//     it('should delete a user by id', async () => {
//       jest.spyOn(service, 'deleteUser').mockResolvedValue(deletedUser);

//       const result = await controller.deleteUser({origin:subdomain},userId,updatedId);
//       expect(result).toEqual(deletedUser);
//       expect(service.deleteUser).toHaveBeenCalledWith(userId,updatedId,subdomain);
//     });
//   });

//   describe('updateuser', ()=> {

//     const userData = {
//       first_name: "Lukas",
//       last_name: "Don",
//       email: "user@gmail.com",
//       password: "haspassword",
//       unique_identifier:"asd123",
//       role: BigInt(1),
//       id: BigInt(13),
//       forbidUnknownValues: true,
//     };

//     const updatedUser = {
//       "status": "success",
//       "response": "Changes Saved.",
//       "status_code": 204
//     }
// let subdomain = process.env.REALM_NAME
//     it('should update a user by id', async () => {
//       jest.spyOn(service, 'update').mockResolvedValue(updatedUser);
//       const result = await controller.update({origin:subdomain},userData);
//       expect(result).toEqual(updatedUser);
//       expect(service.update).toHaveBeenCalledWith(userData,subdomain);
//     });
//   });

//   describe('searchUsers', () => {
//     const search: SearchUserDto = {
//       search: "John"
//     }
//     const userId = BigInt(123);
//     const searchedUser = {
//       total_records: 1,
//       page_number: 1,
//       data:[{
//       id: userId,
//       email: 'johndoe@example.com',
//       first_name: 'John',
//       last_name: 'Doe',
//       password: "1234567",
//       is_active: true,
//       created_at: new Date(),
//       updated_at: new Date(),
//       is_archived:false,
//       role: BigInt(1),
//       created_by:BigInt(23),
//       is_super_admin:false,
//       tenant : BigInt(1),
//       keycloak_username: 'johndoe@example.com',
//       is_manager: true,
//       hierarchy_level: "region",
//       business_unit: 1,
//       assigned_manager: 6,
//       override: true,
//       adjust_appointment_slots: false,
//       resource_sharing: false,
//       edit_locked_fields: false,
//       account_state: true,
//     }]};

//     it('should search a user by query', async () => {
//       jest.spyOn(service, 'searchUsers').mockResolvedValue(searchedUser);

//       const result = await controller.searchUsers(search);
//       expect(result).toEqual(searchedUser);
//       expect(service.searchUsers).toHaveBeenCalledWith(search);
//     });
//   });

//   describe('users lists', () => {
//     const userSearch = {
//       limit: 10,
//       page: 1,
//     };

//     const searchedUser: any = {
//       totalRecords: 1,
//       pageNumber: 1,
//       data: [
//         {
//         id: BigInt(123),
//         email: 'johndoe@example.com',
//         first_name: 'John',
//         last_name: 'Doe',
//         password: "1234567",
//         is_active: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//         role: BigInt(1),
//         created_by:BigInt(123),
//         },
//       ],
//     };

//     it('should lists the users', async () => {
//       jest.spyOn(service, 'getUsers').mockResolvedValue(searchedUser);

//       const result = await controller.getUsers(userSearch);
//       expect(result).toEqual(searchedUser);
//       expect(service.getUsers).toHaveBeenCalledWith(userSearch);
//     });
//   });

// });

describe('calculateSumFiveRun', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumFiveRun(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumFiveRun(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumFiveRun(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumFiveRun(a: number, b: number): number {
  return a + b;
}
