import { Test, TestingModule } from '@nestjs/testing';
import { RoomSizeController } from '../controller/roomsizes.controller';
import { RoomSizesService } from '../services/roomSizes.service';
import { CreateRoomSizeDto } from '../dto/create-room-sizes.dto';
import { RoomSize } from '../entity/roomsizes.entity';

// describe('RoomSizeController', () => {
//   // let controller: RoomSizeController;
//   // let service: RoomSizesService;

//   // beforeEach(async () => {
//   //   const module: TestingModule = await Test.createTestingModule({
//   //     controllers: [RoomSizeController],
//   //     providers: [
//   //       {
//   //         provide: RoomSizesService,
//   //         useValue: {
//   //           create: jest.fn(),
//   //           getAllRoomSizes: jest.fn(),
//   //           getRoom: jest.fn(),
//   //         },
//   //       },
//   //     ],
//   //   }).compile();
//   //   controller = module.get<RoomSizeController>(RoomSizeController);
//   //   service = module.get<RoomSizesService>(RoomSizesService);
//   // });
//   // it('should be defined', () => {
//   //   expect(controller).toBeDefined();
//   // });
//   /* create */
//   /* describe('create', () => {
//     const createRoomInput = {
//       created_by: BigInt(1),
//       updated_by: BigInt(1),
//       name: 'test room',
//       description: 'test room desctiption',
//       is_active: true,
//       is_archived: false,
//       forbidUnknownValues: true,
//     };

//     const room: any = {
//       status: 'success',
//       response: 'Room Created Successfully',
//       status_code: 201,
//       data: {
//         name: 'test room',
//         description: 'test room desctiption',
//         is_active: true,
//         created_by: 1,
//         is_archived: false,
//         id: '3',
//         created_at: '2023-08-14T02:34:04.945Z',
//       },
//     };

//     it('should create room', async () => {
//       jest.spyOn(service, 'create').mockResolvedValue(room);
//       const result = await controller.create(createRoomInput);
//       expect(result).toEqual(room);
//       expect(service.create).toHaveBeenCalledWith(createRoomInput);
//     });
//   }); */
//   /* get all */
//  /*  describe('listOfAllRoomSizes', () => {
//     const roomID = BigInt(123);
//     const roomSearch = {
//       page: 1,
//       name: '',
//       status: '',
//       fetchAll: '',
//     };
//     const rooms = {
//       id: roomID,
//       name: 'room',
//       description: 'Description',
//       is_active: true,
//       is_archived: false,
//       created_at: '2023-07-25T06:02:15.384Z',
//     };

//     const response = {
//       total_records: 2,
//       page_number: 1,
//       totalPage: 1,
//       data: [],
//     };

//     it('should get all roomsSizes', async () => {
//       jest.spyOn(service, 'getAllRoomSizes').mockResolvedValue(response);
//       const result = await controller.getAllRoomSizes(roomSearch);
//       console.log(result);
//       expect(result).toEqual(response);
//       expect(service.getAllRoomSizes).toHaveBeenCalledWith(roomSearch);
//     });
//   }); */
//   /* get by :id */
//  /*  describe('getRoom', () => {
//     const roomId = BigInt(123);

//     const room = {
//       id: roomId,
//       name: 'test room',
//       description: 'test room desctiption',
//       is_active: true,
//       is_archived: false,
//       created_at: new Date(),
//       created_by: BigInt(123),
//     };

//     it('should get a room by id', async () => {
//       jest.spyOn(service, 'getRoom').mockResolvedValue(room);

//       const result = await controller.getRoom(roomId);
//       expect(result).toEqual(room);
//       expect(service.getRoom).toHaveBeenCalledWith(roomId);
//     });
//   }); */
// });
