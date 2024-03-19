import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorController } from './controller/donor.controller';
import { Donor } from './entities/donor.entity';
import { DonorService } from './services/donor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorController],
  providers: [DonorService],
  exports: [DonorService],
})
export class DonorModule {}
