import {
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Put,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAttachmentCategoryDto } from '../dto/create.category.dto';
import { UpdateAttachmentCategoryDto } from '../dto/update-category.dto';
import { AttachmentCategoryService } from '../services/category.services';
import { GetAllAttachmentCategoryInterface } from '../interface/category.interface';

@ApiTags('Location Attachment Category')
@Controller('locations/attachment-category')
export class AttachmentCategoryController {
  constructor(
    private readonly noteCategoryService: AttachmentCategoryService
  ) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteCategoryDto: CreateAttachmentCategoryDto) {
    return this.noteCategoryService.create(createNoteCategoryDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() getAllNoteCategoryInterface: GetAllAttachmentCategoryInterface
  ) {
    return this.noteCategoryService.getAll(getAllNoteCategoryInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: any) {
    return this.noteCategoryService.getSingleAttachmentCategory(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateNoteCategoryDto: UpdateAttachmentCategoryDto
  ) {
    return this.noteCategoryService.updateAttachmentCategory(
      id,
      updateNoteCategoryDto
    );
  }

  @Patch('/:id')
  async delete(@Param('id') id: number) {
    return this.noteCategoryService.deleteAttachmentCategory(id);
  }
}
