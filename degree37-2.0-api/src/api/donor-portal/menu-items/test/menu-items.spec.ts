import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from '../controller/menu-items.controller';
import { CreateMenuItemsDto, UpdateMenuItemsDto } from '../dto/menu-items.dto';
import { MenuItemsService } from '../services/menu-items.service';

describe('MenuItemsController', () => {
  let controller: MenuItemsController;
  let service: MenuItemsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        {
          provide: MenuItemsService,
          useValue: {
            addMenuItems: jest.fn(),
            getAllMenuItems: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuItemsController>(MenuItemsController);
    service = module.get<MenuItemsService>(MenuItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addMenuItem', () => {
    const menuItemData: CreateMenuItemsDto = {
      title: 'string',
      url: 'string',
      is_protected: true,
      parent_id: true,
      navigation_type: 'string',
      client_id: 'string',
      forbidUnknownValues: true,
    };

    const createdMenuItemData = {
      ...menuItemData,
      id: BigInt(123),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdMenuItem = {
      status: 201,
      success: true,
      count: null,
      message: 'Menu Item Created Successfully',
      data: createdMenuItemData,
    };

    it('should create a new Menu Item', async () => {
      jest.spyOn(service, 'addMenuItems').mockResolvedValue(createdMenuItem);

      const result = await controller.create(menuItemData);
      expect(result).toEqual(createdMenuItem);
      expect(service.addMenuItems).toHaveBeenCalledWith(menuItemData);
    });
  });

  describe('listOfMenuItems', () => {
    const id = BigInt(123);
    const menuSearch = {
      page: 1,
    };
    const items = {
      id: id,
      title: 'apple',
      url: 'string',
      is_protected: true,
      parent_id: true,
      navigation_type: 'string',
      client_id: 'string',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const menuItems = {
      status: 200,
      success: true,
      count: 1,
      message: 'Menu Item Fetched Successfully',
      data: items,
    };

    it('should get all menu items', async () => {
      jest.spyOn(service, 'getAllMenuItems').mockResolvedValue(menuItems);
      const result = await controller.findAll(menuSearch);
      expect(result).toEqual(menuItems);
      expect(service.getAllMenuItems).toHaveBeenCalledWith(menuSearch);
    });
  });

  describe('GetSingleMenuItem', () => {
    const id = BigInt(1);
    const input = {
      id: id,
    };

    const items = {
      id: id,
      title: 'apple',
      url: 'string',
      is_protected: true,
      parent_id: true,
      navigation_type: 'string',
      client_id: 'string',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const menuItems = {
      status: 200,
      success: true,
      message: 'Menu Item Fetched Successfully',
      data: items,
    };

    it('should get a single menu item', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(menuItems);

      const result = await controller.findOne(input);
      expect(result).toEqual(menuItems);
      expect(service.findOne).toHaveBeenCalledWith(input);
    });
  });

  describe('UpdateMenuItem', () => {
    const menuItemId = BigInt(123);
    const MenuItemData: UpdateMenuItemsDto = {
      title: 'string',
      url: 'string',
      is_protected: true,
      parent_id: true,
      navigation_type: 'string',
      client_id: 'string',
      is_active: true,
    };

    const updatedEmailTemplate = {
      status: HttpStatus.OK,
      message: 'Menu Item Updated Succesfully',
    };

    it('should update a menu item', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(updatedEmailTemplate);

      const result = await controller.update(menuItemId, MenuItemData);
      expect(result).toEqual(updatedEmailTemplate);
      expect(service.update).toHaveBeenCalledWith(menuItemId, MenuItemData);
    });
  });
});
