import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Pickups } from '../entities/pickups.entity';
import { PickupsHistory } from '../entities/pickups-history.entity';
import { PickupDto } from '../dto/pickup.dto';
import { GetAllPickupsInterface } from '../interface/get-drives-filter.interface';
import { Drives } from '../entities/drives.entity';
import { DrivesHistory } from '../entities/drives-history.entity';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
dotenv.config();

@Injectable()
export class PickupService {
  constructor(
    @InjectRepository(Pickups)
    private readonly pickupRepository: Repository<Pickups>,
    @InjectRepository(PickupsHistory)
    private readonly pickupHistoryRepository: Repository<PickupsHistory>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(DrivesHistory)
    private readonly drivesHistoryRepository: Repository<DrivesHistory>,
    private readonly entityManager: EntityManager
  ) {}

  async findAll(id: any, getAllPickupsInterface: GetAllPickupsInterface) {
    const limit: number = getAllPickupsInterface?.limit
      ? +getAllPickupsInterface.limit
      : +process.env.PAGE_SIZE;

    const page = getAllPickupsInterface?.page
      ? +getAllPickupsInterface.page
      : 1;
    const where: any = { pickable_id: { id: id }, is_archived: false };
    const [response, count] = await this.pickupRepository.findAndCount({
      where: where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['created_by', 'equipment_id', 'pickable_id'],
    });

    return {
      status: HttpStatus.OK,
      response: 'Pickups Fetched.',
      count: count,
      data: response,
    };
  }

  async createPickups(id: any, user: User, createPickupDto: PickupDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const drive = await this.drivesRepository.findOneBy({
        id,
        is_archived: false,
      });

      if (!drive) {
        return resError(
          "Drive doesn't exist.",
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const pickup = new Pickups();
      pickup.created_by = user;
      pickup.description = createPickupDto?.description;
      pickup.equipment_id = createPickupDto?.equipment_id;
      pickup.pickable_id = createPickupDto?.pickable_id || id;
      pickup.pickable_type = createPickupDto?.pickable_type;
      pickup.start_time = createPickupDto?.start_time;
      const savedPickup: Pickups = await queryRunner.manager.save(pickup);

      // add update drive history
      await this.drivesHistoryRepository.insert({
        ...drive,
        history_reason: HistoryReason.C,
        created_by: user?.id,
        created_at: new Date(),
      });

      await queryRunner.commitTransaction();

      return resSuccess(
        'Pickup Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedPickup
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
