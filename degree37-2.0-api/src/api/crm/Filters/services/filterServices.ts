import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { FilterCriteria } from '../entities/filter_criteria';
import { FilterSaved } from '../entities/filter_saved';
import { FilterSavedCriteria } from '../entities/filter_saved_criteria';
import { FilterDto } from '../dto/filter.dto';
import { In } from 'typeorm/find-options/operator/In.js';
@Injectable()
export class FilterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FilterCriteria)
    private readonly filterCriteriaRepository: Repository<FilterCriteria>,
    @InjectRepository(FilterSaved)
    private readonly filterSavedRepository: Repository<FilterSaved>,
    @InjectRepository(FilterSavedCriteria)
    private readonly filterSavedCriteriaRepository: Repository<FilterSavedCriteria> // @InjectRepository(User) // private readonly userRepository: Repository<User>, // private readonly entityManager: EntityManager
  ) {}

  async findFilterStructure(code: any) {
    const application_code = code;

    try {
      const getData = await this.filterCriteriaRepository.find({
        where: {
          application_code: application_code,
        },
      });
      if (getData.length > 0) {
        return resSuccess(
          'filter fetched.',
          SuccessConstants.SUCCESS,
          HttpStatus.CREATED,
          { ...getData }
        );
      } else {
        return resError(
          'No filter against this code',
          ErrorConstants.Error,
          400
        );
      }
    } catch (e) {
      console.log({ e });
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async AddFilter(user: any, body: FilterDto) {
    try {
      const userId = user?.id;
      const userData = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (body.filter_Array.length === 0) {
        return resError(`invalid data`, ErrorConstants.Error, 400);
      }

      // Check if the name exists with the same application_code
      const nameExists = await this.filterSavedRepository.findOne({
        where: {
          name: body.filter_name,
          application_code: body.application_code,
          is_archived: false,
        },
      });

      if (nameExists) {
        return resError(
          `Name '${body.filter_name}' already exists for application code '${body.application_code}'. Please choose a different name.`,
          ErrorConstants.Error,
          400
        );
      }

      const filterSaved = new FilterSaved();
      filterSaved.application_code = body.application_code;
      filterSaved.name = body.filter_name;
      filterSaved.created_by = user;
      const savedFilter = await this.filterSavedRepository.save(filterSaved);

      const promises = body.filter_Array.map(async (item: any) => {
        if (item.filter_saved_value?.length === 0) {
          return null; // Skip this item
        }
        const findId = await this.filterCriteriaRepository.findOne({
          where: {
            application_code: body.application_code,
            name: item.name,
          },
        });
        if (!findId) {
          console.error(`Filter criteria not found for ${item.name}`);
          return resError(
            `Filter criteria not found for ${item.name}`,
            ErrorConstants.Error,
            400
          );
        }

        const data = item.filter_saved_value.map((value: any) => ({
          filter_saved_id: savedFilter,
          filter_criteria_id: findId,
          filter_saved_value: value,
          created_by: userData,
        }));

        await this.filterSavedCriteriaRepository.save(data);

        return data; // Return the saved data
      });

      const savedData = await Promise.all(promises);
      const hasError = savedData.some((data) => data === null);

      if (hasError) {
        await this.filterSavedRepository.remove(savedFilter);
        return resError(`Invalid data`, ErrorConstants.Error, 400);
      }

      return resSuccess(
        'filter fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        ''
      );
    } catch (e) {
      console.log({ e });
      console.error('e', e);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getFilters(user: any, code: any) {
    try {
      const userId = user?.id;
      const userData = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      const findCriteria: any = await this.filterCriteriaRepository.find({
        where: {
          application_code: code,
        },
      });

      // const criteriaIds = findCriteria.map((criteria) => criteria.id);
      const findSavedFilters = await this.filterSavedRepository.find({
        where: {
          application_code: code,
          is_archived: false,
          created_by: { id: user?.id },
        },
        relations: ['created_by'],
      });

      return resSuccess(
        'filter fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...findSavedFilters }
      );
    } catch (err) {
      console.log({ err });
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getFilterSubData(user: any, id: any) {
    try {
      const userId = user?.id;
      const userData = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      const findAllFilters: any = await this.filterSavedCriteriaRepository.find(
        {
          where: {
            filter_saved_id: {
              id,
            },
            created_by: {
              id: userId,
            },
          },
          relations: ['created_by', 'filter_saved_id', 'filter_criteria_id'], // Update this line
        }
      );
      return resSuccess(
        'filter fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...findAllFilters }
      );
    } catch (err) {
      console.log({ err });
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async DeleteFilter(user: any, id: any, code: any) {
    try {
      const userId = user?.id;
      const userData = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      const findSavedFilters = await this.filterSavedRepository.findOne({
        where: {
          id: id,
          application_code: code,
          created_by: { id: userData?.id },
        },
        relations: ['created_by'],
      });

      if (!findSavedFilters) {
        return resError(
          `findSavedFilters not found`,
          ErrorConstants.Error,
          400
        );
      }

      findSavedFilters.id = findSavedFilters.id;
      findSavedFilters.is_archived = true;
      findSavedFilters.application_code = findSavedFilters.application_code;
      findSavedFilters.is_predefined = findSavedFilters.is_predefined;
      findSavedFilters.name = findSavedFilters.name;
      findSavedFilters.created_by = findSavedFilters.created_by;

      const savedData = await this.filterSavedRepository.save(findSavedFilters);
      const findAllFilters: any = await this.filterSavedCriteriaRepository.find(
        {
          where: {
            filter_saved_id: {
              id,
            },
            created_by: {
              id: userId,
            },
          },
          relations: ['created_by', 'filter_saved_id'], // Update this line
        }
      );
      if (findAllFilters.length == 0) {
        return resError(`findAllFilters not found`, ErrorConstants.Error, 400);
      }
      findAllFilters.map(async (item, index) => {
        item.is_archived = true;
        await this.filterSavedCriteriaRepository.save({ ...item });
      });

      return resSuccess(
        'filter deleted.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...findAllFilters, ...findSavedFilters }
      );
    } catch (err) {
      console.log({ err });
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
