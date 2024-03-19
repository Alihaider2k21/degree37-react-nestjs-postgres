import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Put,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNotesDto } from '../dto/create-note.dto';
import { NotesService } from '../services/note.service';
import { UpdateNotesDto } from '../dto/update-note.dto';
import { NotesFiltersInterface } from '../interface/note.interface';

@Controller('/notes')
@ApiTags('Notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNotesDto: CreateNotesDto, @Request() req: UserRequest) {
    return this.notesService.create(createNotesDto, req);
  }

  @Get()
  @ApiBearerAuth()
  findAll(
    @Query() notesFiltersInterface: NotesFiltersInterface,
    @Request() req: UserRequest
  ) {
    notesFiltersInterface.tenant_id = req.user.tenant.id;
    return this.notesService.findAll(notesFiltersInterface);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any, @Request() req: UserRequest) {
    return this.notesService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateNotesDto: UpdateNotesDto,
    @Request() req: UserRequest
  ) {
    return this.notesService.update(id, updateNotesDto, req);
  }

  @Patch('/archive/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.notesService.archive(id, req);
  }
}
