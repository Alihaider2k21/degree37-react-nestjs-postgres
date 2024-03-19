import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { GetProductsInterface } from '../interface/products.interface';
import { UserRequest } from '../../../../../../../common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_WRITE
  )
  create() {
    return 'Products Created';
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_WRITE
  )
  findAll(
    @Query() getProductsInterface: GetProductsInterface,
    @Request() req: UserRequest
  ) {
    return this.productsService.getAllProducts(getProductsInterface, req.user);
  }

  @Get(':id')
  // @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_WRITE
  )
  findOne() {
    return 'Single Product Fetched';
  }

  @Put(':id/edit')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_WRITE
  )
  // @ApiParam({ name: 'id', required: true })
  update() {
    return 'Product Edited';
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PRODUCTS_ARCHIVE
  )
  remove() {
    return 'Products Deleted';
  }
}
