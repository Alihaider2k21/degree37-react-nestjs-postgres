// import { Test, TestingModule } from '@nestjs/testing';
// import { DailyGoalsAllocationController } from '../controller/daily-goals-allocation.controller';
// import { DailyGoalsAllocationService } from '../service/daily-goals-allocation.service';

// describe('DailyGoalAllocationService', () => {
//   let dailyGoalAllocationsController: DailyGoalsAllocationController;
//   let dailyGoalAllocationsService: DailyGoalsAllocationService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DailyGoalsAllocationController],
//       providers: [
//         {
//           provide: DailyGoalsAllocationService,
//           useValue: {
//             findAll: jest.fn(),
//             create: jest.fn(),
//             findOne: jest.fn(),
//             archiveDailyGoal: jest.fn()
//           },
//         },
//       ],
//     }).compile();
//     dailyGoalAllocationsController = module.get<DailyGoalsAllocationController>(
//       DailyGoalsAllocationController,
//     );
//     dailyGoalAllocationsService =
//       module.get<DailyGoalsAllocationService>(DailyGoalsAllocationService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {

//     const dailGoalAllocationData = {
//         effective_date: new Date("2023-08-01 14:16:39.830431"),
//         collection_operation: [1, 2],
//         procedure_type_id: BigInt(1),
//         sunday: 0,
//         monday: 0,
//         tuesday: 0,
//         wednesday: 0,
//         thursday: 0,
//         friday: 0,
//         saturday: 0,
//         created_by: BigInt(1),
//         tenant_id: BigInt(1),
//       };

//     const createdDailGoalAllocation = {
//         status: "success",
//         response: "Daily Goal Created Successfully",
//         status_code: 201,
//         data: {
//           effective_date: "2023-08-01T04:16:39.830Z",
//           sunday: 0,
//           monday: 0,
//           tuesday: 0,
//           wednesday: 0,
//           thursday: 0,
//           friday: 0,
//           saturday: 0,
//           id: "4",
//           created_at: "2023-08-03T11:04:58.847Z",
//         },
//       };

//     it('should create a new Daily Goal', async () => {
//       jest
//         .spyOn(dailyGoalAllocationsService, 'create')
//         .mockResolvedValue(createdDailGoalAllocation);

//       const result = await dailyGoalAllocationsController.create(dailGoalAllocationData,{user:{id:1,tenant:{id:1}}} as any);
//       expect(result).toEqual(createdDailGoalAllocation);
//       expect(dailyGoalAllocationsService.create).toHaveBeenCalledWith(dailGoalAllocationData);
//     });
//   });

//   describe('listOfAllDailGoalsAllocations', () => {
//     const search:any = {
//       collection_operation:[1,2],
//       procedure_type:1,
//       selected_date:"2023-08-01 00:00:00",
//       page: 1,
//       limit: 10
//     };

//     const dailyGoalAllocations: any =  {
//       status: 200,
//       response: 'Daily Goals Fetched Succesfuly',
//       count: 4,
//       data: [
//         {
//           id: '7',
//           effective_date: '2023-08-01T04:16:39.830Z',
//           sunday: 0,
//           monday: 0,
//           tuesday: 0,
//           wednesday: 0,
//           thursday: 0,
//           friday: 0,
//           saturday: 0,
//           is_archived: false,
//           created_at: '2023-08-03T16:10:06.196Z',
//           procedure_type: {
//             id: '1',
//             name: 'asd',
//             short_description: 'adsasd',
//             description: null,
//             is_goal_type: false,
//             is_archive: false,
//             procedure_duration: '12',
//             is_generate_online_appointments: false,
//             is_active: false,
//             created_at: '2023-08-03T10:08:42.513Z',
//           },
//           created_by: {
//             id: '1',
//             firstName: 'string',
//             lastName: 'string',
//             email: 'string@gmail.com',
//             password: '$2b$10$ikxvPbb6djMeHo4PLpRMduB8wN6TbZwFg6B9n5joULwGSSoRLxSC6',
//             isActive: true,
//             createdAt: '2023-08-01T09:16:39.830Z',
//             updatedAt: '2023-08-01T09:16:39.830Z',
//             deletedAt: null,
//           },
//           collection_operation: [
//             {
//               id: '2',
//               name: 'aasd',
//               short_label: 'asdad',
//               description: 'asdsa',
//               is_active: true,
//               created_at: '2023-08-03T10:23:10.782Z',
//             },
//           ],
//         },
//       ],
//     };

//     it('should get all Daily Goals Allocation', async () => {
//       jest
//         .spyOn(dailyGoalAllocationsService, 'findAll')
//         .mockResolvedValue(dailyGoalAllocations);
//       const result = await dailyGoalAllocationsController.findAll(search,{user:{id:1,tenant:{id:1}}} as any);
//       expect(result).toEqual(dailyGoalAllocations);
//       expect(dailyGoalAllocationsService.findAll).toHaveBeenCalledWith(
//         search,
//       );
//     });
//   });

//   describe('get daily goals allocation', () => {

//     const id = 1;

//     const dailyGoalsAllocation:any = {
//       status: "success",
//       response: "Daily goal allocation fetched successfully.",
//       status_code: 201,
//       data: {
//         id:  BigInt(1),
//         effective_date: new Date(),
//         sunday: 10,
//         monday: 10,
//         tuesday: 10,
//         wednesday: 10,
//         thursday: 10,
//         friday: 10,
//         saturday: 0,
//         is_archived: false,
//         created_at: new Date(),
//         procedure_type: {
//           id:  BigInt(1),
//           name: "TTTT",
//           short_description: "TTTTT",
//           description: "TTTTT",
//           is_goal_type: false,
//           is_archive: false,
//           procedure_duration: "1",
//           is_generate_online_appointments: false,
//           is_active: false,
//           created_at: new Date()
//         },
//         created_by: {
//           id:  BigInt(1),
//           firstName: "Awa",
//           lastName: "Ali",
//           email: "mailto:aawais@cc.com",
//           password: "$2a$12$ILZpzz7kB0qERToRkXtpFeml/93vFOZa9L.3YwiWXeN2m2o6w27GS",
//           isActive: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           deletedAt: null
//         },
//         collection_operation: [
//           {
//             id: BigInt(1),
//             name: "Awais",
//             short_label: "dfghjkjhgfd",
//             description: "fghjhgfd",
//             is_active: true,
//             created_at: new Date()
//           }
//         ]
//       }
//     }

//     it('should create a new Daily Goal', async () => {
//       jest
//         .spyOn(dailyGoalAllocationsService, 'findOne')
//         .mockResolvedValue(dailyGoalsAllocation);

//       const result = await dailyGoalAllocationsController.findOne(id,{user:{id:1,tenant:{id:1}}} as any);
//       expect(result).toEqual(dailyGoalsAllocation);
//       expect(dailyGoalAllocationsService.findOne).toHaveBeenCalledWith(id);
//     });
//   });

//   describe('archive daily goal', () => {
//     it('should archive daily goal if found', async () => {
//       const id = 1;

//       const response: any = {
//         response: 'Daily Goal Archived successfully',
//         status: 'success',
//         code: 200,
//         data: null,
//       };

//       jest
//         .spyOn(dailyGoalAllocationsService, 'archiveDailyGoal')
//         .mockResolvedValue(response);

//       const result = await dailyGoalAllocationsController.archiveRole(id,{user:{id:1,tenant:{id:1}}} as any);

//       expect(result).toEqual(response);
//       expect(dailyGoalAllocationsService.archiveDailyGoal).toHaveBeenCalledWith(id);
//     });
//   });
// });

describe('calculateSum', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumOne(a: number, b: number): number {
  return a + b;
}
