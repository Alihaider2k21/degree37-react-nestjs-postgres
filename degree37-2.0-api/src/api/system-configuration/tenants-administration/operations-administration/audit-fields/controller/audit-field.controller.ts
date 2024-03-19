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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuditFieldsService } from '../services/audit-field.service';
@ApiTags('Audit Fields')
@Controller('booking-drive/audit-fields')
export class AuditFieldController {
  constructor(private readonly auditFieldService: AuditFieldsService) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findAll() {
    console.log('controller');

    return await this.auditFieldService.getAllAuditFields();
  }

  @Get(':id')
  // @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  findOne() {
    return 'Single Product Fetched';
  }

  @Put(':id/edit')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  // @ApiParam({ name: 'id', required: true })
  update() {
    return 'Product Edited';
  }

  @Delete(':id')
  remove() {
    return 'Products Deleted';
  }
}
