import {
  Controller,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
  Res,
  HttpStatus,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { BBCSDataSyncsService } from '../services/bbcs_data_syncs.service';

@ApiTags('BBCS Donors')
@Controller('/bbcs/')
export class BBCSDataSyncsController {
  constructor(private readonly BBCSDataSyncsService: BBCSDataSyncsService) {}

  @Patch('/donors/sync')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async syncDonors(@Res() response) {
    const lastRun = await this.BBCSDataSyncsService.getLastRunDonorSync();
    if (lastRun?.is_running) {
      response.status(200).json({ message: 'Cron is already running.' });
    } else {
      response
        .status(200)
        .json({ message: 'Cron Started, Request received successfully' });
      await this.BBCSDataSyncsService.syncDonors();
    }
    // return this.BBCSDataSyncsService.syncDonors();
  }

  @Patch('/accounts/sync')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async syncAccounts() {
    return await this.BBCSDataSyncsService.syncAccounts();
  }
}
