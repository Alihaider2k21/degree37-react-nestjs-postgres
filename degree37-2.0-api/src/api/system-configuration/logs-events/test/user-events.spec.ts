import { Test, TestingModule } from '@nestjs/testing';
import { UserEventController } from '../controller/user-event.controller';
import { UserEventService } from '../services/user-event.service';
import UserEventDto, { EventStatus, EventType } from '../dto/user-event.dto';
import UserEvents from '../entities/user-event.entity';
describe('UserEventController', () => {
  let controller: UserEventController;
  let service: UserEventService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEventController],
      providers: [
        {
          provide: UserEventService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<UserEventController>(UserEventController);
    service = module.get<UserEventService>(UserEventService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    const userEventData: UserEventDto = {
      email: 'johndoe@example.com',
      activity: 'login',
      eventType: EventType.LOGIN_SUCCESS,
      ip: '127.0.0.1',
      page_name: 'login',
      status: EventStatus.Success,
    };
    const createdUserEvent: UserEvents = {
      ...userEventData,
      id: BigInt(123),
      created_at: new Date(),
      date_time: new Date(),
      type: EventType.LOGIN_SUCCESS,
    };
    it('should create a new user event', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(createdUserEvent);
      const result = await controller.create(userEventData, null, null);
      expect(result).toEqual(createdUserEvent);
      expect(service.create).toHaveBeenCalledWith(userEventData);
    });
  });
});
