import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from '../helpers/api-response/api-response';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateMenuItemsDto, UpdateMenuItemsDto } from '../dto/menu-items.dto';
import { MenuItems } from '../entities/menu-items.entity';
import {
  GetMenuItemsInterface,
  GetSingleMenuItemInterface,
} from '../interface/menu-items.interface';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItems)
    private readonly menuItemsRepository: Repository<MenuItems>
  ) {}

  async addMenuItems(createMenuItemsDto: CreateMenuItemsDto) {
    try {
      const data = await this.menuItemsRepository.save(createMenuItemsDto);
      if (data) {
        return ApiResponse.success(
          'Menu Item Created Successfully',
          HttpStatus.CREATED,
          data
        );
      } else {
        return new HttpException(
          'Error Creating Menu Item',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllMenuItems(getMenuItemsInterface: GetMenuItemsInterface) {
    try {
      const limit: number = getMenuItemsInterface?.limit
        ? +getMenuItemsInterface?.limit
        : +process.env.PAGE_SIZE;

      const page = getMenuItemsInterface?.page
        ? +getMenuItemsInterface?.page
        : 1;

      const where = {};
      if (getMenuItemsInterface?.title) {
        Object.assign(where, {
          title: Like(`%${getMenuItemsInterface?.title}%`),
        });
      }

      const [response, count] = await this.menuItemsRepository.findAndCount({
        where,
        take: limit,
        skip: (page - 1) * limit,
        order: { id: 'DESC' },
      });

      if (count > 0) {
        return ApiResponse.success(
          'Menu Item Fetched Successfully',
          HttpStatus.CREATED,
          response,
          count
        );
      }

      return ApiResponse.success(
        'No Menu Items Found',
        HttpStatus.CREATED,
        response,
        count
      );
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(
    singleMenuItemInterface: GetSingleMenuItemInterface
  ): Promise<any> {
    try {
      const response = await this.menuItemsRepository.findOne({
        where: { id: singleMenuItemInterface.id },
      });
      if (!response) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Please enter a valid menu item id',
          data: response,
        };
      }

      return ApiResponse.success(
        'Menu Item Fetched Succesfully',
        HttpStatus.OK,
        response
      );
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: bigint,
    updateMenuItemDto: UpdateMenuItemsDto
  ): Promise<any> {
    if (id > 0) {
      const menuItem = await this.menuItemsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!menuItem) {
        return new HttpException(
          'Please enter a valid menu item id',
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedData = {
        ...menuItem,
        ...updateMenuItemDto,
      };

      const updatedMenuItem = await this.menuItemsRepository.update(
        {
          id: id,
        },
        {
          title: updatedData?.title,
          url: updatedData?.url,
          is_protected: updatedData?.is_protected,
          parent_id: updatedData?.parent_id,
          navigation_type: updatedData?.navigation_type,
          is_active: updatedData?.is_active,
          client_id: updatedData?.client_id,
        }
      );

      if (updatedMenuItem.affected) {
        return ApiResponse.success(
          'Menu Item Updated Succesfully',
          HttpStatus.OK
        );
      }

      throw new NotFoundException('Menu Item with provided id did not update');
    } else {
      throw new HttpException(
        'Menu item id is required',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
