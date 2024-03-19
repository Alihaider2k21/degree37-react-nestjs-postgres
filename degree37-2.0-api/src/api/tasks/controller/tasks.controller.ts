import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Put,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { TasksService } from '../services/tasks.service';
import { UserRequest } from 'src/common/interface/request';
import { TasksDto } from '../dto/create-tasks.dto';
import {
  GetAllTasksInterface,
  TasksQuery,
} from '../interface/tasks-query.interface';
import { UpdateTasksDto } from '../dto/update-tasks.dto';

@ApiTags('Tasks')
@Controller('/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.tasksService.findOne(+id);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Query() taskQuery: TasksQuery,
    @Request() req: UserRequest,
    @Body() createTasksDto: TasksDto
  ) {
    return this.tasksService.create(
      req?.user,
      createTasksDto,
      taskQuery?.taskable_type,
      taskQuery?.taskable_id
    );
  }

  @Get()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() getAllTasksInterface: GetAllTasksInterface,
    @Request() req: UserRequest
  ) {
    return this.tasksService.findAll(req?.user, getAllTasksInterface);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateTasksDto: UpdateTasksDto,
    @Request() req: UserRequest
  ) {
    return this.tasksService.update(id, updateTasksDto, req.user);
  }

  @Put('/archive/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.tasksService.archiveTask(id, req.user);
  }
}
