import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorController } from './controller/sponsor.group.controller';
import { BBCSConnector } from 'src/connector/bbcsconnector';

@Module({
  controllers: [SponsorController],
  providers: [BBCSConnector],
  exports: [BBCSConnector],
})
export class SponsorModule {}
