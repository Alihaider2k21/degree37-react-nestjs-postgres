import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { DriveCertificationsDto } from '../dto/drives-contact.dto';
import { DrivesCertifications } from '../entities/drives-certifications.entity';
import { DrivesCertificationsHistory } from '../entities/drives-certifications-history.entity';
import { Drives } from '../entities/drives.entity';
import { DrivesHistory } from '../entities/drives-history.entity';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
dotenv.config();

@Injectable()
export class DriveCertificationsService {
  constructor(
    @InjectRepository(DrivesCertifications)
    private readonly driveCertificationsRepository: Repository<DrivesCertifications>,
    @InjectRepository(DrivesCertificationsHistory)
    private readonly drivesCertificationsHistoryRepository: Repository<DrivesCertificationsHistory>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(DrivesHistory)
    private readonly drivesHistoryRepository: Repository<DrivesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createCertifications(
    id: any,
    user: User,
    createCertificationsDto: DriveCertificationsDto
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
      let savedDriveCertifications: any;
      if (createCertificationsDto?.deleteCertifications?.length > 0) {
        for (const item of createCertificationsDto.deleteCertifications) {
          const where: any = {
            certification_id: item,
            drive_id: id,
            is_archived: false,
          };
          const drive_certifications: any =
            await this.driveCertificationsRepository.findOne({
              where: where,
              relations: ['created_by', 'drive', 'certification'],
            });
          const drive_certifications_history =
            new DrivesCertificationsHistory();
          drive_certifications_history.history_reason = 'D';
          drive_certifications_history.certification_id =
            drive_certifications?.certification?.id;
          drive_certifications_history.drive_id =
            drive_certifications?.drive?.id;
          drive_certifications_history.created_by = user?.id;
          drive_certifications_history.created_at = new Date();
          historyPromises.push(
            this.drivesCertificationsHistoryRepository.save(
              drive_certifications_history
            )
          );

          drive_certifications.is_archived = true;
          deletePromises.push(
            this.driveCertificationsRepository.save(drive_certifications)
          );
        }
        await Promise.all(historyPromises);
        await Promise.all(deletePromises);
        savedDriveCertifications = [];
      }
      const promises = [];
      if (createCertificationsDto?.certifications?.length > 0) {
        for (const element of createCertificationsDto.certifications) {
          const certifications = new DrivesCertifications();
          certifications.is_archived = false;
          certifications.created_by = user;
          certifications.drive_id = id;
          certifications.certification_id = element?.certification;

          promises.push(
            this.driveCertificationsRepository.save(certifications)
          );
        }
        savedDriveCertifications = await Promise.all(promises);

        // add update drive history
        await this.drivesHistoryRepository.insert({
          ...drive,
          history_reason: HistoryReason.C,
          created_by: user?.id,
          created_at: new Date(),
        });
      }

      return resSuccess(
        'Certifications Added.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDriveCertifications
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getModifiedData(drive: Drives) {
    const history = await this.drivesCertificationsHistoryRepository.findOne({
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
