import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { CreateQualificationDto } from '../dto/qualification.dto';
import { Qualification } from '../entities/qualification.entity';
import { GetAllQualificationInterface } from '../interface/qualification.interface';
import { HistoryService } from '../../../../common/services/history.service';
import { QualificationHistory } from '../entities/qualification-history.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import moment from 'moment';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

@Injectable()
export class QualificationService extends HistoryService<QualificationHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Qualification)
    private readonly qualificationRepository: Repository<Qualification>,
    @InjectRepository(QualificationHistory)
    private readonly qualificationHistoryRepository: Repository<QualificationHistory>,
    private readonly entityManager: EntityManager
  ) {
    super(qualificationHistoryRepository);
  }

  /**
   * check entity exist in database
   * @param repository
   * @param query
   * @param entityName
   * @returns {object}
   */
  async entityExist<T>(
    repository: Repository<T>,
    query,
    entityName
  ): Promise<T> {
    const entityObj = await repository.findOne(query);
    if (!entityObj) {
      throw new HttpException(`${entityName} not found.`, HttpStatus.NOT_FOUND);
    }

    return entityObj;
  }

  async findAll(getAllQualificationInterface: GetAllQualificationInterface) {
    try {
      const limit: number = getAllQualificationInterface?.limit
        ? +getAllQualificationInterface.limit
        : +process.env.PAGE_SIZE;

      const page = getAllQualificationInterface?.page
        ? +getAllQualificationInterface.page
        : 1;

      const [response, count] = await this.qualificationRepository.findAndCount(
        {
          where: {
            ...(getAllQualificationInterface?.location_id && {
              location_id: getAllQualificationInterface?.location_id,
            }),
            ...(getAllQualificationInterface?.qualification_status && {
              qualification_status:
                getAllQualificationInterface?.qualification_status,
            }),
          },
          take: limit,
          skip: (page - 1) * limit,
          relations: ['created_by'],
        }
      );

      return {
        status: HttpStatus.OK,
        response: 'Qualification Fetched ',
        count: count,
        data: response,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Qualification findAll >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async create(user: any, createQualificationDto: CreateQualificationDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const userId = user?.id;

      const userData = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      const createQualification = new Qualification();
      const keys = Object.keys(createQualificationDto);

      for (const key of keys) {
        if (key === 'qualification_date') {
          createQualification[key] = moment(
            createQualificationDto?.[key]
          ).toDate();
        } else {
          createQualification[key] = createQualificationDto?.[key];
        }
      }
      createQualification.created_by = userData ?? userData;
      // Save the Qualification entity
      const savedQualification = await queryRunner.manager.save(
        createQualification
      );
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Qualification created ',
        status_code: 201,
        data: savedQualification,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: any): Promise<any> {
    try {
      const qualification = await this.qualificationRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!qualification) {
        return new HttpException(
          'Please enter a valid qualification id',
          HttpStatus.BAD_REQUEST
        );
      }

      const deletedQualification = await this.qualificationRepository.delete(
        id
      );
      if (deletedQualification.affected) {
        return {
          status: HttpStatus.OK,
          message: 'Qualification Deleted Successfully',
        };
      } else {
        throw new Error('Qualification with provided id did not delete');
      }
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Qualification remove >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}
