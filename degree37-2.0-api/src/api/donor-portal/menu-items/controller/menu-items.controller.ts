import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateMenuItemsDto, UpdateMenuItemsDto } from '../dto/menu-items.dto';
import {
  GetMenuItemsInterface,
  GetSingleMenuItemInterface,
} from '../interface/menu-items.interface';
import { MenuItemsService } from '../services/menu-items.service';

@ApiTags('Menu Items')
@Controller('api/menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMenuItemsDto: CreateMenuItemsDto) {
    return this.menuItemsService.addMenuItems(createMenuItemsDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(@Query() getMenuItemsInterface: GetMenuItemsInterface) {
    return this.menuItemsService.getAllMenuItems(getMenuItemsInterface);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findOne(@Param() singleMenuItemInterface: GetSingleMenuItemInterface) {
    return this.menuItemsService.findOne(singleMenuItemInterface);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  update(@Param('id') id: any, @Body() updateMenuItemsDto: UpdateMenuItemsDto) {
    return this.menuItemsService.update(id, updateMenuItemsDto);
  }
}
