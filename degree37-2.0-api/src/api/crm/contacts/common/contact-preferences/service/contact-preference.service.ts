import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { UserRequest } from 'src/common/interface/request';
import { REQUEST } from '@nestjs/core';
import { ContactPreferences } from '../entities/contact-preferences';
import { ContactPreferencesHistory } from '../entities/contact-preferences-history';
import { CreateContactPreferenceDto } from '../dto/create-contact-preference.dto';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { GetContactPreferenceInterface } from '../interface/contact-preference.interface';

@Injectable({ scope: Scope.REQUEST })
export class ContactPreferenceService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(ContactPreferences)
    private readonly contactPreferencesRepository: Repository<ContactPreferences>,
    @InjectRepository(ContactPreferencesHistory)
    private readonly contactPreferencesHistoryRepository: Repository<ContactPreferencesHistory>
  ) {}
  async create(createContactPreferenceDto: CreateContactPreferenceDto) {
    try {
      const contactPreference = await this.contactPreferencesRepository.findOne(
        {
          where: {
            contact_preferenceable_id:
              createContactPreferenceDto?.contact_preferenceable_id,
            contact_preferenceable_type:
              createContactPreferenceDto?.contact_preferenceable_type,
          },
        }
      );
      if (contactPreference) {
        return resError(
          'Contact Preference already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }
      // Save the contact preference
      const savedContactPreference =
        await this.contactPreferencesRepository.save({
          ...createContactPreferenceDto,
          created_by: this.request?.user,
          tenant_id: this.request?.user?.tenant,
        });

      const getContactPreference =
        await this.contactPreferencesRepository.findOne({
          where: {
            id: savedContactPreference?.id,
          },
        });

      return resSuccess(
        'Contact Preference Created Successfully',
        'success',
        HttpStatus.CREATED,
        getContactPreference
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(
    id: any,
    updateContactPreferenceDto: CreateContactPreferenceDto
  ) {
    try {
      // Find the contact preference to update
      const contactPreference = await this.contactPreferencesRepository.findOne(
        {
          where: {
            id,
          },
        }
      );

      if (!contactPreference) {
        return resError(
          'Contact Preference not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      // Save the updated contact preference
      await this.contactPreferencesRepository.update(
        id,
        updateContactPreferenceDto
      );

      // Fetch the updated contact preference
      const updatedContactPreference =
        await this.contactPreferencesRepository.findOne({
          where: {
            id,
          },
        });

      if (!updatedContactPreference) {
        return resError(
          'Unable to fetch updated Contact Preference',
          ErrorConstants.Error,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Create a history entry for the update
      await this.createContactPreferenceHistory({
        ...contactPreference,
        created_by: this.request?.user?.id,
        tenant_id: this.request?.user?.tenant.id,
        history_reason: 'C',
      });

      return resSuccess(
        'Contact Preference Updated Successfully',
        'success',
        HttpStatus.OK,
        updatedContactPreference // Return the updated data
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async get(getContactPreferenceInterface: GetContactPreferenceInterface) {
    try {
      // Find the contact preference based on preference_id and type_name
      const contactPreference = await this.contactPreferencesRepository.findOne(
        {
          where: {
            contact_preferenceable_id:
              getContactPreferenceInterface?.preference_id,
            contact_preferenceable_type:
              getContactPreferenceInterface?.type_name,
          },
        }
      );

      if (!contactPreference) {
        return resError(
          'Contact Preference not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Contact Preference Fetched Successfully',
        'success',
        HttpStatus.OK,
        contactPreference
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  // Create a history entry for the contact preference
  private async createContactPreferenceHistory(contactPreferencesHistory: any) {
    // Set properties in contactPreferenceHistory based on the changes made
    // Save the history entry
    await this.contactPreferencesHistoryRepository.save(
      contactPreferencesHistory
    );
  }
}
