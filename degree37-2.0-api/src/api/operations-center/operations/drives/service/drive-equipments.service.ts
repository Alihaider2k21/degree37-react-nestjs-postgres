import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, IsNull, LessThan, Repository, ILike } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { DriveEquipmentsDto } from '../dto/drives-contact.dto';
import { DrivesEquipments } from '../entities/drives-equipment.entity';
import { DrivesEquipmentHistory } from '../entities/drives-equipment-history.entity';
import { Drives } from '../entities/drives.entity';
import { DrivesHistory } from '../entities/drives-history.entity';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
dotenv.config();

@Injectable()
export class DriveEquipmentsService {
  constructor(
    @InjectRepository(DrivesEquipments)
    private readonly driveEquipmentRepository: Repository<DrivesEquipments>,
    @InjectRepository(DrivesEquipmentHistory)
    private readonly drivesEquipmentHistoryRepository: Repository<DrivesEquipmentHistory>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(DrivesHistory)
    private readonly drivesHistoryRepository: Repository<DrivesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createEquipments(
    id: any,
    user: User,
    createEquipmentsDto: DriveEquipmentsDto
  ) {
    try {
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

      const deletePromises = [];
      const historyPromises = [];
      let savedDriveEquiments: any;
      if (createEquipmentsDto?.deleteEquipments?.length > 0) {
        for (const item of createEquipmentsDto.deleteEquipments) {
          const where: any = {
            id: item,
            is_archived: false,
          };
          const drive_equipment: any =
            await this.driveEquipmentRepository.findOne({
              where: where,
              relations: ['created_by', 'drive', 'equipment'],
            });
          const drive_equipment_history = new DrivesEquipmentHistory();
          drive_equipment_history.history_reason = 'D';
          drive_equipment_history.drive_id = drive_equipment?.drive?.id;
          drive_equipment_history.equipment_id = drive_equipment?.equipment?.id;
          drive_equipment_history.quantity = drive_equipment?.quantity;
          drive_equipment_history.created_by = user?.id;
          drive_equipment_history.created_at = new Date();
          historyPromises.push(
            this.drivesEquipmentHistoryRepository.save(drive_equipment_history)
          );

          drive_equipment.is_archived = true;
          deletePromises.push(
            this.driveEquipmentRepository.save(drive_equipment)
          );
        }
        await Promise.all(historyPromises);
        await Promise.all(deletePromises);
        savedDriveEquiments = [];
      }
      const promises = [];
      if (createEquipmentsDto?.equipments?.length > 0) {
        for (const element of createEquipmentsDto.equipments) {
          const equipment = new DrivesEquipments();
          equipment.is_archived = false;
          equipment.created_by = user;
          equipment.drive_id = id;
          equipment.equipment_id = element?.equipment_id;
          equipment.quantity = element?.quantity;

          promises.push(this.driveEquipmentRepository.save(equipment));
        }
        savedDriveEquiments = await Promise.all(promises);

        // add update drive history
        await this.drivesHistoryRepository.insert({
          ...drive,
          history_reason: HistoryReason.C,
          created_by: user?.id,
          created_at: new Date(),
        });
      }

      return resSuccess(
        'Contacts Added.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDriveEquiments
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateEquipments(id: any, user: User) {
    try {
      const where: any = {
        id: id,
        is_archived: false,
      };
      const drive_equipment: any = await this.driveEquipmentRepository.findOne({
        where: where,
        relations: ['created_by', 'drive', 'equipment'],
      });

      if (!drive_equipment) {
        throw new HttpException(`Equipment not found.`, HttpStatus.NOT_FOUND);
      }
      const drive_equipment_history = new DrivesEquipmentHistory();
      drive_equipment_history.history_reason = 'D';
      drive_equipment_history.drive_id = drive_equipment?.drive?.id;
      drive_equipment_history.equipment_id = drive_equipment?.equipment?.id;
      drive_equipment_history.quantity = drive_equipment?.quantity;
      drive_equipment_history.created_by = user?.id;
      drive_equipment_history.created_at = new Date();

      this.drivesEquipmentHistoryRepository.save(drive_equipment_history);

      drive_equipment.is_archived = true;

      const updatedDriveEquipment = await this.driveEquipmentRepository.save(
        drive_equipment
      );
      return resSuccess(
        'Deleted Successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedDriveEquipment
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getModifiedData(drive: Drives) {
    const history = await this.drivesEquipmentHistoryRepository.findOne({
      where: { drive_id: drive.id, is_archived: false },
      order: { created_at: 'DESC' },
    });

    let modified_by = drive.created_by,
      modified_at = drive.created_at;

    if (history) {
      const user = await this.userRepository.findOne({
        where: { id: history.created_by, is_archived: false },
      });
      modified_by = user;
      modified_at = history.created_at;
    }

    return { modified_by, modified_at: new Date(modified_at) };
  }
}
