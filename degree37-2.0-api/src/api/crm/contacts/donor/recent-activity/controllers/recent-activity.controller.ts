import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivityLogService } from '../services/recent-activity.service';
import { CreateActivityLogDto } from '../dto/create-recent-activity.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllDonorActivitiesInterface } from '../interface/recent-activity.interface';

@ApiTags('Donor Actvity')
@Controller('donors/activities')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return this.activityLogService.createDonorActivity(createActivityLogDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll(
    @Query() getAllDonorActivitiesInterface: GetAllDonorActivitiesInterface
  ) {
    return this.activityLogService.findAllDonorActivities(
      getAllDonorActivitiesInterface
    );
  }
}
