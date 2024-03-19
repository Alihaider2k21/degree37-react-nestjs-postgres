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
  Request,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateQualificationDto } from '../dto/qualification.dto';
import { GetAllQualificationInterface } from '../interface/qualification.interface';
import { QualificationService } from '../service/qualification.service';
import { UserRequest } from 'src/common/interface/request';

@ApiTags('Qualification')
@Controller('/locations')
export class QualificationController {
  constructor(private readonly QualificationService: QualificationService) {}

  @Get(':location_id/qualification')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  getQualification(
    @Query() getAllQualificationInterface: GetAllQualificationInterface
  ) {
    return this.QualificationService.findAll(getAllQualificationInterface);
  }

  // @Get("/:id")
  // @ApiParam({ name: "id", required: true, type: Number })
  // @UsePipes(new ValidationPipe())
  // @HttpCode(HttpStatus.OK)
  // getStage(@Param("id") id: any) {
  //   return this.QualificationService.findOne(id);
  // }

  @Post(':location_id/qualification')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'location_id', required: true })
  async createQualification(
    @Request() req: UserRequest,
    @Body() createQualificationDto: CreateQualificationDto
  ) {
    return this.QualificationService.create(req.user, createQualificationDto);
  }

  @Delete(':location_id/qualification/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'location_id', required: true })
  @HttpCode(HttpStatus.GONE)
  deleteQualification(
    @Param('location_id') locationId: any,
    @Param('id') id: any
  ) {
    return this.QualificationService.remove(id);
  }
}
