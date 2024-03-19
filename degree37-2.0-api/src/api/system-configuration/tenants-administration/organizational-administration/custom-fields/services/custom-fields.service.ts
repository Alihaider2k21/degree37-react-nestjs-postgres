import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateCustomFieldDataDto,
  CreateCustomFieldDto,
} from '../dto/create-custom-field.dto';
import {
  UpdateCustomFieldDto,
  updateCustomFieldDataDto,
} from '../dto/update-custom-field.dto';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Repository, EntityManager, Not, ILike, In } from 'typeorm';
import { CustomFields } from '../entities/custom-field.entity';
import { PickLists } from '../entities/pick-lists.entity';
import { CustomFieldsData } from '../entities/custom-filed-data.entity';
import { CustomFieldsDataHistory } from '../entities/custom-filed-data-history';
import { CustomFieldsHistory } from '../entities/custome-field-history.entity';
import { PickListsHistory } from '../entities/pick-lists-history.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import {
  GetAllCustomFieldDataInterface,
  GetAllCustomFieldInterface,
} from '../interface/custom-field.interface';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { appliesToTypeEnum } from '../enum/custom-field.enum';

@Injectable()
export class CustomFieldsService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CustomFields)
    private readonly customFieldRepository: Repository<CustomFields>,
    @InjectRepository(PickLists)
    private readonly pickListsRepository: Repository<PickLists>,
    @InjectRepository(CustomFieldsData)
    private readonly customFieldDataRepository: Repository<CustomFieldsData>,
    @InjectRepository(CustomFieldsHistory)
    private readonly customFieldHistoryRepository: Repository<CustomFieldsHistory>,
    @InjectRepository(PickListsHistory)
    private readonly pickListsHistoryRepository: Repository<PickListsHistory>,
    @InjectRepository(CustomFieldsDataHistory)
    private readonly customFieldDataHistoryRepository: Repository<CustomFieldsDataHistory>
  ) {}
  async create(createCustomFieldDto: CreateCustomFieldDto) {
    try {
      const {
        field_name,
        field_data_type,
        applies_to,
        is_required,
        is_active,
        pick_list,
      } = createCustomFieldDto;
      const user = await this.userRepository.findOneBy({
        id: this.request.user?.id,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      if (!field_name) {
        throw new HttpException(
          `Field name is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!field_data_type) {
        throw new HttpException(
          `Field data type is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!applies_to) {
        throw new HttpException(
          `Applies to is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const customField: any = new CustomFields();
      customField.field_name = field_name;
      customField.field_data_type = field_data_type;
      customField.applies_to = applies_to;
      customField.tenant_id = this.request.user?.tenant;
      customField.created_by = this.request?.user;
      customField.is_required = is_required ?? false;
      customField.is_active = is_active ?? true;
      const savedCustomField = await this.customFieldRepository.save(
        customField
      );

      if (!savedCustomField) {
        throw new HttpException(
          `Error in creating custom field.`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (pick_list?.length && savedCustomField) {
        for (let i = 0; i < pick_list.length; i++) {
          const item = pick_list[i];

          const pickList = new PickLists();
          pickList.applies_to = applies_to;
          pickList.type_name = item?.type_name;
          pickList.type_value = item?.type_value;
          pickList.tenant_id = this.request.user?.tenant;
          pickList.created_by = this.request?.user;
          pickList.is_active = is_active;
          pickList.sort_order = BigInt(i + 1);
          pickList.custom_field_id = savedCustomField;

          await this.pickListsRepository.save(pickList);
        }
      }

      const getCustomField = await this.customFieldRepository.findOne({
        where: { id: savedCustomField?.id },
        relations: ['pick_list'],
        order: {
          pick_list: {
            sort_order: 'ASC',
          },
        },
      });

      return resSuccess(
        'Custom Field Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        getCustomField || null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(params: GetAllCustomFieldInterface) {
    try {
      const fetchAll = params?.fetchAll === 'true';

      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }
      const where: any = { is_archived: false };
      Object.assign(where, {
        tenant_id: { id: this.request.user?.tenant?.id },
      });

      if (params?.keyword) {
        Object.assign(where, {
          field_name: ILike(`%${params?.keyword}%`),
        });
      }

      if (params?.applies_to) {
        Object.assign(where, {
          applies_to: `${params?.applies_to}`,
        });
      }
      let order: any = { id: 'DESC' }; // Default order

      if (params?.sortBy) {
        // Allow sorting by different columns
        const orderBy = params.sortBy;
        const orderDirection = params.sortOrder || 'DESC';
        order = { [orderBy]: orderDirection };
      }

      if (
        params?.status !== undefined &&
        params?.status !== '' &&
        params?.status !== 'undefined'
      ) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }

      let response: any;
      let count: any;

      if (fetchAll) {
        [response, count] = await this.customFieldRepository.findAndCount({
          relations: ['pick_list'],
          where,
          order,
        });
      } else {
        [response, count] = await this.customFieldRepository.findAndCount({
          where,
          relations: ['pick_list'],
          take: limit,
          skip: (page - 1) * limit,
          order,
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Custom fields fetched successfully',
        count: count,
        data: response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const customField: any = await this.customFieldRepository.findOne({
        where: { id: id, is_archived: false },
        relations: ['created_by', 'pick_list'],
        order: {
          pick_list: {
            sort_order: 'ASC',
          },
        },
      });

      if (!customField) {
        throw new HttpException(
          `Custom Field not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      if (customField?.pick_list?.length) {
        customField.pick_list = customField.pick_list.filter(
          (picklist: any): any => !picklist.is_archived
        );
      }
      const modifiedData: any = await getModifiedDataDetails(
        this.customFieldHistoryRepository,
        id,
        this.userRepository
      );

      return resSuccess(
        'Custom field found successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { ...customField, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updateCustomFieldDto: UpdateCustomFieldDto) {
    try {
      if (!updateCustomFieldDto?.field_name) {
        throw new HttpException(
          `Field name is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!updateCustomFieldDto?.field_data_type) {
        throw new HttpException(
          `Field data type is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!updateCustomFieldDto?.applies_to) {
        throw new HttpException(
          `Applies to is required.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const customField: any = await this.customFieldRepository.findOne({
        where: {
          id: id,
          is_archived: false,
        },
        relations: ['tenant_id', 'pick_list'],
      });

      if (!customField) {
        throw new HttpException(
          `Custom Field not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const customFieldHistory = new CustomFieldsHistory();
      customFieldHistory.history_reason = 'C';
      customFieldHistory.id = customField?.id;
      customFieldHistory.field_name = customField?.field_name;
      customFieldHistory.field_data_type = customField?.field_data_type;
      customFieldHistory.applies_to = customField?.applies_to;
      customFieldHistory.is_required = customField?.is_required;
      customFieldHistory.is_active = customField?.is_active;
      customFieldHistory.created_by = this.request?.user?.id;
      customFieldHistory.tenant_id = customField?.tenant_id?.id;
      const savedcustomFieldHistory =
        await this.customFieldHistoryRepository.save(customFieldHistory);

      // Update custom field properties
      customField.field_name =
        updateCustomFieldDto?.field_name ?? customField?.field_name;
      customField.field_data_type =
        updateCustomFieldDto?.field_data_type ?? customField?.field_data_type;
      customField.applies_to =
        updateCustomFieldDto?.applies_to ?? customField?.applies_to;
      customField.created_by = this.request?.user;
      customField.is_required = updateCustomFieldDto.hasOwnProperty(
        'is_required'
      )
        ? updateCustomFieldDto?.is_required
        : customField?.is_required;
      customField.is_active = updateCustomFieldDto.hasOwnProperty('is_active')
        ? updateCustomFieldDto?.is_active
        : customField?.is_active;

      const updatedCustomField = await this.customFieldRepository.save(
        customField
      );

      // Process pick lists
      if (updateCustomFieldDto?.pick_list?.length) {
        const orderedPickList = updateCustomFieldDto.pick_list;

        const updatedPicklistIds = orderedPickList.map((item) =>
          String(item.id)
        );

        const existingPicklists: any[] = await this.pickListsRepository.find({
          where: {
            custom_field_id: { id: id },
          },
          relations: ['custom_field_id', 'tenant_id', 'created_by'],
        });

        const removedPicklists = existingPicklists.filter(
          (existingPicklist) =>
            !updatedPicklistIds.includes(String(existingPicklist.id))
        );

        for (const removedPicklist of removedPicklists) {
          // Create a history record before deleting
          const picklistHistory = new PickListsHistory();
          picklistHistory.history_reason = 'D';
          picklistHistory.id = removedPicklist.id;
          picklistHistory.applies_to = removedPicklist.applies_to;
          picklistHistory.type_name = removedPicklist.type_name;
          picklistHistory.type_value = removedPicklist.type_value;
          picklistHistory.is_active = removedPicklist.is_active;
          picklistHistory.created_by = this.request.user?.id;
          picklistHistory.is_archived = removedPicklist.is_archived;
          picklistHistory.custom_field_id = removedPicklist.custom_field_id?.id;
          picklistHistory.tenant_id = removedPicklist.tenant_id?.id;

          await this.pickListsHistoryRepository.save(picklistHistory);

          // Delete the picklist
          await this.pickListsRepository.save({
            ...removedPicklist,
            is_archived: true,
          });
        }
        for (let i = 0; i < orderedPickList.length; i++) {
          const item = orderedPickList[i];
          if (item?.id) {
            // If the item has an id, update the existing picklist
            const existingPickList: any =
              await this.pickListsRepository.findOne({
                where: {
                  id: item?.id,
                },
                relations: ['custom_field_id', 'tenant_id'],
              });

            if (!existingPickList) {
              // console.error(`Picklist with ID ${item.id} not found.`);
              throw new HttpException(
                `Picklist with ID ${item?.id} not found.`,
                HttpStatus.NOT_FOUND
              );
            } else {
              existingPickList.sort_order = item?.sort_order;
              const picklistHistory = new PickListsHistory();
              picklistHistory.history_reason = 'C';
              picklistHistory.id = existingPickList?.id;
              picklistHistory.applies_to = existingPickList?.applies_to;
              picklistHistory.type_name = existingPickList?.type_name;
              picklistHistory.type_value = existingPickList?.type_value;
              picklistHistory.is_active = existingPickList?.is_active;
              picklistHistory.created_by = this.request?.user?.id;
              picklistHistory.is_archived = existingPickList?.is_archived;
              picklistHistory.custom_field_id =
                existingPickList?.custom_field_id?.id;
              picklistHistory.tenant_id = existingPickList?.tenant_id?.id;
              const savedpickListsHistory =
                await this.pickListsHistoryRepository.save(picklistHistory);
            }
            existingPickList.type_name = item.type_name;
            existingPickList.type_value = item.type_value;
            existingPickList.is_active = updateCustomFieldDto?.is_active;
            existingPickList.created_by = this.request?.user;
            existingPickList.sort_order = BigInt(i + 1);

            await this.pickListsRepository.save(existingPickList);
          } else {
            // If the item doesn't have an id, create a new picklist
            const newPickList: any = new PickLists();
            newPickList.applies_to = updateCustomFieldDto?.applies_to;
            newPickList.type_name = item.type_name;
            newPickList.type_value = item.type_value;
            newPickList.tenant_id = this.request.user?.tenant;
            newPickList.created_by = this.request.user;
            newPickList.is_active = updateCustomFieldDto?.is_active;
            newPickList.custom_field_id = updatedCustomField;
            newPickList.sort_order = BigInt(i + 1);

            await this.pickListsRepository.save(newPickList);
          }
        }
      } else {
        const existingPicklists: any[] = await this.pickListsRepository.find({
          where: {
            custom_field_id: { id: id },
          },
          relations: ['custom_field_id', 'tenant_id'],
        });
        for (const existingPicklist of existingPicklists) {
          // Create a history record before archiving
          const picklistHistory = new PickListsHistory();
          picklistHistory.history_reason = 'D'; // Use 'A' for archive
          picklistHistory.id = existingPicklist.id;
          picklistHistory.applies_to = existingPicklist.applies_to;
          picklistHistory.type_name = existingPicklist.type_name;
          picklistHistory.type_value = existingPicklist.type_value;
          picklistHistory.is_active = existingPicklist.is_active;
          picklistHistory.created_by = this.request.user?.id;
          picklistHistory.is_archived = existingPicklist.is_archived;
          picklistHistory.custom_field_id =
            existingPicklist.custom_field_id?.id;
          picklistHistory.tenant_id = existingPicklist.tenant_id?.id;

          await this.pickListsHistoryRepository.save(picklistHistory);

          // Archive the picklist
          existingPicklist.is_archived = true;
          await this.pickListsRepository.save(existingPicklist);
        }
      }

      const customFieldData = await this.customFieldRepository.findOne({
        where: {
          id: id,
        },
        relations: ['tenant_id', 'pick_list', 'created_by'],
        order: {
          pick_list: {
            sort_order: 'ASC',
          },
        },
      });
      // Filter out archived picklists
      if (customFieldData?.pick_list?.length) {
        customFieldData.pick_list = customFieldData.pick_list.filter(
          (picklist) => !picklist.is_archived
        );
      }

      return resSuccess(
        'Custom Field updated.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        customFieldData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: any) {
    try {
      const customField = await this.customFieldRepository.findOne({
        where: { id },
        relations: ['created_by', 'pick_list', 'tenant_id'],
      });

      if (!customField) {
        throw new HttpException(
          `Custom Field not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      if (customField?.pick_list?.length) {
        for (const item of customField?.pick_list) {
          const pickListData = await this.pickListsRepository.findOne({
            where: { id: item?.id },
            relations: ['custom_field_id', 'tenant_id'],
          });
          if (item?.is_archived === false) {
            const picklistHistory = new PickListsHistory();
            picklistHistory.history_reason = 'C';
            picklistHistory.id = pickListData?.id;
            picklistHistory.applies_to = pickListData?.applies_to;
            picklistHistory.type_name = pickListData?.type_name;
            picklistHistory.type_value = pickListData?.type_value;
            picklistHistory.is_active = pickListData?.is_active;
            picklistHistory.created_by = this.request?.user?.id;
            picklistHistory.custom_field_id = pickListData?.custom_field_id?.id;
            picklistHistory.tenant_id = pickListData?.tenant_id?.id;
            const savedpickListsHistory =
              await this.pickListsHistoryRepository.save(picklistHistory);
            const afterArchived = await this.pickListsRepository.save({
              ...pickListData,
              is_archived: true,
            });
            if (afterArchived?.is_archived) {
              const picklistHistory = new PickListsHistory();
              picklistHistory.history_reason = 'D';
              picklistHistory.id = afterArchived?.id;
              picklistHistory.applies_to = afterArchived?.applies_to;
              picklistHistory.type_name = afterArchived?.type_name;
              picklistHistory.type_value = afterArchived?.type_value;
              picklistHistory.is_active = afterArchived?.is_active;
              picklistHistory.created_by = this.request?.user?.id;
              picklistHistory.custom_field_id =
                afterArchived?.custom_field_id?.id;
              picklistHistory.tenant_id = afterArchived?.tenant_id?.id;
              const savedpickListsHistory =
                await this.pickListsHistoryRepository.save(picklistHistory);
            }
          }
        }
      }

      if (customField?.is_archived === false) {
        const customFieldHistory: any = new CustomFieldsHistory();
        customFieldHistory.history_reason = 'C';
        customFieldHistory.id = customField?.id;
        customFieldHistory.field_name = customField?.field_name;
        customFieldHistory.field_data_type = customField?.field_data_type;
        customFieldHistory.applies_to = customField?.applies_to;
        customFieldHistory.is_required = customField?.is_required;
        customFieldHistory.is_active = customField?.is_active;
        customFieldHistory.created_by = this.request?.user?.id;
        customFieldHistory.tenant_id = customField?.tenant_id?.id;
        customFieldHistory.is_archived = customField?.is_archived;
        const savedcustomFieldHistory =
          await this.customFieldHistoryRepository.save(customFieldHistory);

        customField.is_archived = true;
        const afterArchived = await this.customFieldRepository.save(
          customField
        );
        if (afterArchived?.is_archived) {
          const customFieldHistory: any = new CustomFieldsHistory();
          customFieldHistory.history_reason = 'D';
          customFieldHistory.id = afterArchived?.id;
          customFieldHistory.field_name = afterArchived?.field_name;
          customFieldHistory.field_data_type = afterArchived?.field_data_type;
          customFieldHistory.applies_to = afterArchived?.applies_to;
          customFieldHistory.is_required = afterArchived?.is_required;
          customFieldHistory.is_active = afterArchived?.is_active;
          customFieldHistory.created_by = this.request?.user?.id;
          customFieldHistory.tenant_id = afterArchived?.tenant_id?.id;
          customFieldHistory.is_archived = afterArchived?.is_archived;
          const savedcustomFieldHistory =
            await this.customFieldHistoryRepository.save(customFieldHistory);
        }
      } else {
        throw new HttpException(
          `Custom field is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Custom field archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getCustomFieldModules(id: any) {
    try {
      const isValidEnumValue = Object.values(appliesToTypeEnum).includes(id);
      if (!isValidEnumValue) {
        throw new HttpException(
          `Invalid Module value. Supported values are: ${Object.values(
            appliesToTypeEnum
          ).join(', ')}`,
          HttpStatus.BAD_REQUEST
        );
      }

      const where: any = { is_archived: false };
      Object.assign(where, {
        tenant_id: { id: this.request.user?.tenant?.id },
      });

      Object.assign(where, {
        is_active: true,
      });

      const queryBuilder = this.customFieldRepository
        .createQueryBuilder('customField')
        .where({
          ...where,
        })
        .leftJoinAndSelect('customField.pick_list', 'pick_list')
        .leftJoinAndSelect('customField.tenant_id', 'tenant_id')
        .orderBy({
          'customField.id': 'ASC',
          'pick_list.sort_order': 'ASC',
        });

      // Conditionally add 'applies_to' and 'pick_list.is_archived = false' conditions
      queryBuilder.andWhere(
        '(customField.applies_to = :appliesTo AND (pick_list.id IS NULL OR pick_list.is_archived = :isArchived))',
        { appliesTo: String(id), isArchived: false }
      );

      const fields = await queryBuilder.getMany();

      if (!fields.length) {
        throw new HttpException(
          `Custom fields not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      return {
        status: HttpStatus.OK,
        message: 'Custom fields fetched successfully',
        data: fields,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async createCustomFieldData(
    createCustomFieldDataDto: CreateCustomFieldDataDto
  ) {
    try {
      const {
        fields_data,
        custom_field_datable_id,
        custom_field_datable_type,
      } = createCustomFieldDataDto;

      if (!custom_field_datable_id) {
        throw new HttpException(
          `custom_field_datable_id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!custom_field_datable_type) {
        throw new HttpException(
          `custom_field_datable_type is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const responseData = [];

      if (fields_data?.length) {
        for (const item of fields_data) {
          const customField = await this.customFieldRepository.findOne({
            where: { id: item?.field_id, is_archived: false },
          });

          if (!customField) {
            throw new HttpException(
              `Field not found for ID ${item?.field_id}.`,
              HttpStatus.BAD_REQUEST
            );
          }

          if (customField?.is_required && !item?.field_data) {
            throw new HttpException(
              `Field data must be required for field id ${customField?.id}.`,
              HttpStatus.BAD_REQUEST
            );
          }
          const customFieldData = new CustomFieldsData();
          customFieldData.custom_field_datable_id = custom_field_datable_id;
          customFieldData.custom_field_datable_type = custom_field_datable_type;
          customFieldData.field_id = customField;
          customFieldData.tenant_id = this.request.user?.tenant;
          customFieldData.created_by = this.request?.user;
          customFieldData.tenant_id = this.request?.user?.tenant;
          customFieldData.field_data = item?.field_data;

          responseData.push(
            await this.customFieldDataRepository.save(customFieldData)
          );
        }
      }
      return resSuccess(
        'Custom Field Data Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        responseData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateCustomFieldData(
    createCustomFieldDataDto: updateCustomFieldDataDto
  ) {
    try {
      const {
        fields_data,
        custom_field_datable_id,
        custom_field_datable_type,
      } = createCustomFieldDataDto;

      if (!custom_field_datable_id) {
        throw new HttpException(
          `custom_field_datable_id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!custom_field_datable_type) {
        throw new HttpException(
          `custom_field_datable_id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const responseData = [];

      if (fields_data?.length) {
        for (const item of fields_data) {
          const customField = await this.customFieldRepository.findOne({
            where: { id: item?.field_id, is_archived: false },
          });

          if (!customField) {
            throw new HttpException(`Field not found.`, HttpStatus.BAD_REQUEST);
          }

          // If 'id' is absent, it's a new option; if 'id' is present, update the existing one
          if (!item.id) {
            const customFieldData = new CustomFieldsData();
            customFieldData.custom_field_datable_id = custom_field_datable_id;
            customFieldData.custom_field_datable_type =
              custom_field_datable_type;
            customFieldData.field_id = customField;
            customFieldData.tenant_id = this.request.user?.tenant;
            customFieldData.created_by = this.request?.user;
            customFieldData.tenant_id = this.request?.user?.tenant;
            customFieldData.field_data = item?.field_data;

            responseData.push(
              await this.customFieldDataRepository.save(customFieldData)
            );
          } else {
            const existingcustomFieldData =
              await this.customFieldDataRepository.findOne({
                where: { id: item?.id },
                relations: ['field_id', 'tenant_id'],
              });

            console.log({ existingcustomFieldData });

            if (!existingcustomFieldData) {
              throw new HttpException(
                `Custom field data not found for id ${item?.id}.`,
                HttpStatus.BAD_REQUEST
              );
            }
            if (customField?.is_required && !item?.field_data) {
              throw new HttpException(
                `Field data must be required for id ${customField?.id}.`,
                HttpStatus.BAD_REQUEST
              );
            }

            const customFieldDataHistory = new CustomFieldsDataHistory();
            customFieldDataHistory.history_reason = 'C';
            customFieldDataHistory.id = existingcustomFieldData?.id;
            customFieldDataHistory.custom_field_datable_id =
              existingcustomFieldData?.custom_field_datable_id;
            customFieldDataHistory.custom_field_datable_type =
              existingcustomFieldData?.custom_field_datable_type;
            customFieldDataHistory.field_id =
              existingcustomFieldData?.field_id?.id;
            customFieldDataHistory.tenant_id =
              existingcustomFieldData?.tenant_id?.id;
            customFieldDataHistory.created_by = this.request.user?.id;
            customFieldDataHistory.is_archived =
              existingcustomFieldData.is_archived;
            customFieldDataHistory.field_data =
              existingcustomFieldData.field_data;
            customFieldDataHistory.tenant_id =
              existingcustomFieldData.tenant_id?.id;

            await this.customFieldDataHistoryRepository.save(
              customFieldDataHistory
            );

            existingcustomFieldData.created_by = this.request?.user;
            existingcustomFieldData.field_data = item?.field_data;

            responseData.push(
              await this.customFieldDataRepository.save(existingcustomFieldData)
            );
          }
        }
      }

      // Identify deleted options and set them to inactive
      const existingOptions = await this.customFieldDataRepository.find({
        where: {
          custom_field_datable_id: custom_field_datable_id,
          custom_field_datable_type: custom_field_datable_type,
        },
      });

      const updatedIds = fields_data.map((item) => BigInt(item.id));
      const deletedOptions = existingOptions.filter((data) => {
        return !updatedIds.includes(BigInt(data.id));
      });

      for (const item of deletedOptions) {
        const optionToUpdate = { ...item };
        optionToUpdate.is_active = false;
        await this.customFieldDataRepository.save(optionToUpdate);
      }

      return resSuccess(
        'Custom Field Data updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getCustomFieldData(
    getAllCustomFieldDataInterface: GetAllCustomFieldDataInterface
  ) {
    const { custom_field_datable_id, custom_field_datable_type }: any =
      getAllCustomFieldDataInterface;

    try {
      if (!custom_field_datable_id) {
        throw new HttpException(
          `custom_field_datable_id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!custom_field_datable_type) {
        throw new HttpException(
          `custom_field_datable_type is required.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const customFieldsData: any = await this.customFieldDataRepository.find({
        where: {
          custom_field_datable_type: custom_field_datable_type,
          custom_field_datable_id: custom_field_datable_id,
          is_archived: false,
        },
        relations: ['field_id', 'field_id.pick_list'],
      });

      return resSuccess(
        'Custom Field Data found.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        customFieldsData || []
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
