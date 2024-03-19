import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, In, IsNull, Not, Repository } from 'typeorm';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../system-configuration/helpers/response';
import { ErrorConstants } from '../../system-configuration/constants/error.constants';
import { Donors } from 'src/api/crm/contacts/donor/entities/donors.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Contacts } from 'src/api/crm/contacts/common/entities/contacts.entity';
import { BBCSConnector } from 'src/connector/bbcsconnector';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { ContactTypeEnum } from 'src/api/crm/contacts/common/enums';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { ContactPreferences } from 'src/api/crm/contacts/common/contact-preferences/entities/contact-preferences';
import { BBCSDataSyncs } from '../entities/bbcs_data_syncs.entity';
import { DonorsEligibilities } from 'src/api/crm/contacts/donor/entities/donor_eligibilities.entity';
import { Accounts } from 'src/api/crm/accounts/entities/accounts.entity';
import { IndustryCategories } from 'src/api/system-configuration/tenants-administration/crm-administration/account/industry-categories/entities/industry-categories.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';
import { getTenantConfig } from 'src/api/common/utils/tenantConfig';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';
import moment from 'moment';

dotenv.config();

@Injectable()
export class BBCSDataSyncsService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Donors)
    private readonly donorsRepository: Repository<Donors>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Contacts)
    private readonly Contacts: Repository<Contacts>,
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
    @InjectRepository(IndustryCategories)
    private readonly industryCategoriesRepository: Repository<IndustryCategories>,
    @InjectRepository(BusinessUnits)
    private businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Procedure)
    private readonly procedure: Repository<Procedure>,
    @InjectRepository(BBCSDataSyncs)
    private readonly BBCSDataSyncsRepository: Repository<BBCSDataSyncs>,
    @InjectRepository(TenantConfigurationDetail)
    private readonly tenantConfigRepository: Repository<TenantConfigurationDetail>,
    private readonly BBCSConnectorService: BBCSConnector,
    private readonly entityManager: EntityManager
  ) {}

  async syncDonors() {
    let lastCronRunId = null;
    const cronType = 'DONOR';

    // checking when the job last executed
    const lastRun = await this.BBCSDataSyncsRepository.find({
      where: {
        type: cronType,
        tenant_id: this.request?.user?.tenant?.id,
        is_archived: false,
      },
      order: { id: 'DESC' },
      take: 1,
    });

    // prefetchig the procedures
    const procedures = {};
    (
      await this.procedure.findBy({
        external_reference: Not(IsNull()),
        tenant_id: this.request?.user?.tenant?.id,
        is_active: true,
        is_archive: false,
      })
    ).forEach((proc) => {
      if (!proc.external_reference) return;
      procedures[proc.external_reference] = proc.id;
    });

    // tenant configs
    const tenantConfig = await getTenantConfig(
      this.tenantConfigRepository,
      this.request?.user?.tenant?.id
    );

    // executing the job
    try {
      let updatedDate = lastRun.length
        ? lastRun?.[0]?.job_end
        : new Date('1900-01-01 00:00:00.000');
      const jobStart = lastRun.length ? lastRun?.[0]?.job_end : null;
      let start = lastRun.length ? lastRun?.[0]?.next_start : null;
      const isRunning = lastRun.length ? lastRun?.[0]?.is_running : false;
      const limit = 50;
      let isNext = true;
      let donorsInfo = [];
      while (isNext && !isRunning) {
        await this.BBCSDataSyncsRepository.update(
          { id: lastRun?.[0]?.id },
          {
            is_running: true,
          }
        );
        console.log(
          `Starting BBCS Donors Sync With Params limit = ${limit}, start = ${start}, and updatedDate = ${updatedDate}`
        );
        const data = await this.BBCSConnectorService.fetchDonorsData(
          limit,
          start || '',
          updatedDate?.toISOString(),
          tenantConfig
        );
        console.log('Response from BBCS Received Processing....');
        isNext = data.isNext;
        donorsInfo = data?.data;
        let successInserts = 0;
        for (const donor of donorsInfo) {
          console.log(`Iterating Donor Record # ${successInserts + 1}`);

          // skip the donor if already exists
          if (
            await this.donorsRepository.exist({
              where: { external_id: donor.UUID, is_archived: false },
            })
          ) {
            successInserts++;
            continue;
          }

          // ------------ Donor --------------- //
          const newDonor = new Donors();
          newDonor.external_id = donor.UUID; // UUID - BBCS
          newDonor.donor_number = donor.donorNumber; //  donorNumber - BBCS ?
          newDonor.first_name = donor.firstName; // firstName - BBCS
          newDonor.last_name = donor.lastName; // lastName - BBCS
          newDonor.is_active = true; // - D37
          newDonor.is_archived = false; // - D37
          newDonor.birth_date = donor.birthDate; // birthDate - BBCS
          newDonor.blood_type = donor.bloodType; // birthDate - bloodType
          newDonor.suffix_id = null; // suffix_id - D37 ?
          newDonor.prefix_id = null; // prefix_id - D37 ?
          // nick_name - D37 ?
          newDonor.tenant_id = this?.request?.user?.tenant?.id; // - D37
          newDonor.created_by = this?.request?.user; // - D37
          newDonor.middle_name = donor.middleName; // middleName - BBCS
          newDonor.record_create_date = donor.recordCreateDate; // recordCreateDate - BBCS
          newDonor.last_update_date = donor.lastUpdateDate; // lastUpdateDate - BBCS
          newDonor.next_recruit_date = donor.nextRecruitDate; // nextRecruitDate - BBCS
          newDonor.greatest_deferral_date = donor.greatestDeferralDate; // greatestDeferralDate - BBCS
          newDonor.last_donation_date = donor.lastDonationDate; // lastDonationDate - BBCS
          newDonor.appointment_date = donor.appointmentDate; // appointmentDate - BBCS
          newDonor.gender = donor.gender; // gender - BBCS
          newDonor.geo_code = donor.geoCode; // geoCode - BBCS
          newDonor.group_category = donor.groupCategory; // groupCategory - BBCS
          newDonor.race = donor.race; // race - BBCS
          newDonor.misc_code = donor.miscCode; // miscCode - BBCS
          newDonor.rec_result = donor.recResult; // recResult - BBCS
          newDonor.gallon_award1 = donor.gallonAward1; // gallonAward1 - BBCS
          newDonor.gallon_award2 = donor.gallonAward2; // gallonAward2 - BBCS
          // suffixName  - BBCS ?
          // zipCodeExt  - BBCS ?

          const savedNewDonor = await this.entityManager.save(newDonor);
          // ------------ Donor --------------- //

          // ------------ Address --------------- //
          const address = new Address();
          address.addressable_type = PolymorphicType.CRM_CONTACTS_DONORS;
          address.addressable_id = savedNewDonor.id;
          address.address1 = donor.addressLine1;
          address.address2 = donor.addressLine2;
          address.zip_code = donor.zipCode;
          address.city = donor.city;
          address.state = donor.state;
          address.country = '';
          address.county = '';
          address.latitude = 0;
          address.longitude = 0;
          address.tenant_id = this?.request?.user?.tenant?.id; // - D37
          address.created_by = this?.request?.user; // - D37

          await this.entityManager.save(address);
          // ------------ Address --------------- //

          // ------------ Emails --------------- //
          let primary_email = false;
          for (const email of donor.emailContacts) {
            const emailContact = new Contacts();
            emailContact.contactable_id = savedNewDonor.id;
            emailContact.contactable_type = PolymorphicType.CRM_CONTACTS_DONORS;
            if (donor.code == 'EMAL') {
              // EMAL - Personal Email
              emailContact.contact_type = ContactTypeEnum.PERSONAL_EMAIL;
            } else {
              emailContact.contact_type = ContactTypeEnum.OTHER_EMAIL;
            }
            emailContact.data = email.email;
            emailContact.is_primary = !primary_email;
            emailContact.tenant_id = this?.request?.user?.tenant?.id; // - D37
            emailContact.created_by = this?.request?.user; // - D37
            emailContact.is_archived = false; // - D37
            await this.entityManager.save(emailContact);

            const contactPreference = new ContactPreferences();
            contactPreference.contact_preferenceable_id = savedNewDonor.id;
            contactPreference.contact_preferenceable_type =
              PolymorphicType.CRM_CONTACTS_DONORS;
            contactPreference.is_optout_email = email.canContact; // canContact - BBCS
            contactPreference.is_optout_sms = false;
            contactPreference.is_optout_push = false;
            contactPreference.is_optout_call = false;
            contactPreference.next_call_date = null;
            contactPreference.is_archived = false;
            contactPreference.tenant_id = this?.request?.user?.tenant?.id; // - D37
            contactPreference.created_by = this?.request?.user; // - D37
            await this.entityManager.save(contactPreference);
            primary_email = true;
          }
          // ------------ Emails --------------- //

          let primary_phone = false;
          for (const phone of donor.phoneContacts) {
            const phoneContact = new Contacts();
            phoneContact.is_primary = !primary_phone;
            phoneContact.contactable_id = savedNewDonor.id;
            phoneContact.contactable_type = PolymorphicType.CRM_CONTACTS_DONORS;
            switch (phone.code) {
              case 'WPHN': // WPHN Work Phone - BBCS
                phoneContact.contact_type = ContactTypeEnum.WORK_PHONE;
                break;
              case 'CELL': // CELL Mobile Phone - BBCS
                phoneContact.contact_type = ContactTypeEnum.MOBILE_PHONE;
                break;
              case 'MPHN': // MPHN Mobile Phone - BBCS
                phoneContact.contact_type = ContactTypeEnum.MOBILE_PHONE;
                break;
              default: // HPHN Home Phone  - BBCS
                phoneContact.contact_type = ContactTypeEnum.OTHER_PHONE;
                break;
            }
            phoneContact.data = phone.phoneNumber;
            phoneContact.tenant_id = this?.request?.user?.tenant?.id; // - D37
            phoneContact.created_by = this?.request?.user; // - D37
            phoneContact.is_archived = false; // - D37
            await this.entityManager.save(phoneContact);

            const contactPreference = new ContactPreferences();
            contactPreference.contact_preferenceable_id = savedNewDonor.id;
            contactPreference.contact_preferenceable_type =
              PolymorphicType.CRM_CONTACTS_DONORS;
            contactPreference.is_optout_email = false; // canContact - BBCS
            contactPreference.is_optout_sms = phone.canText;
            contactPreference.is_optout_push = false;
            contactPreference.is_optout_call = phone.canCall;
            contactPreference.next_call_date = null;
            contactPreference.is_archived = false;
            contactPreference.tenant_id = this?.request?.user?.tenant?.id; // - D37
            contactPreference.created_by = this?.request?.user; // - D37
            await this.entityManager.save(contactPreference);
            primary_phone = true;
          }
          console.log(`Get Donor Eligility for Record # ${successInserts + 1}`);

          const donorEligibility =
            await this.BBCSConnectorService.getDonorEligibility(
              donor.UUID,
              moment(),
              tenantConfig
            );

          console.log(
            'Response from BBCS Received for Eligility Processing....'
          );

          for (const key in donorEligibility) {
            const nestedObj = donorEligibility[key];
            for (const nestedKey in nestedObj) {
              const nestedValue = nestedObj[nestedKey];
              const donorEligibilityItem = new DonorsEligibilities();
              donorEligibilityItem.donor_id = savedNewDonor.id;
              donorEligibilityItem.donation_type = procedures[nestedKey];
              donorEligibilityItem.donation_date = nestedValue.lastDate;
              donorEligibilityItem.next_eligibility_date =
                nestedValue.nextEligibleDate;
              donorEligibilityItem.donation_ytd = nestedValue.donationYTD;
              donorEligibilityItem.donation_ltd = nestedValue.donationLTD;
              donorEligibilityItem.donation_last_year =
                nestedValue.donationLastYear;
              donorEligibilityItem.tenant_id = this?.request?.user?.tenant?.id; // - D37
              donorEligibilityItem.created_by = this?.request?.user; // - D37
              await this.entityManager.save(donorEligibilityItem);
            }
          }
          successInserts++;
        }
        const cron_details = new BBCSDataSyncs();
        cron_details.job_start = jobStart;
        cron_details.job_end = data?.nextDate;
        updatedDate = new Date(data?.nextDate);
        cron_details.next_start = data?.nextStart;
        start = data?.nextStart;
        cron_details.status = true;
        cron_details.type = cronType;
        cron_details.inserted_count = successInserts;
        cron_details.updated_count = 0;
        cron_details.total_count = donorsInfo.length;
        cron_details.tenant_id = this?.request?.user?.tenant?.id; // - D37
        cron_details.created_by = this?.request?.user; // - D37
        cron_details.is_running = true; // - D37

        const cronDetails = await this.entityManager.save(cron_details);
        lastCronRunId = cronDetails.id;
      }
      // return resSuccess(
      //   'Donors Synced from BBCS.',
      //   SuccessConstants.SUCCESS,
      //   HttpStatus.CREATED,
      //   {}
      // );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      if (lastCronRunId) {
        await this.BBCSDataSyncsRepository.update(
          { id: Between(lastRun?.[0]?.id, lastCronRunId) },
          {
            is_running: false,
          }
        );
      }
    }
  }

  async getLastRunDonorSync() {
    const cronType = 'DONOR';
    const lastRun = await this.BBCSDataSyncsRepository.find({
      where: {
        type: cronType,
        tenant_id: this.request?.user?.tenant?.id,
        is_archived: false,
      },
      order: { id: 'DESC' },
      take: 1,
    });
    return lastRun?.[0];
  }

  async syncAccounts() {
    try {
      // tenant configs
      const tenantConfig = await getTenantConfig(
        this.tenantConfigRepository,
        this.request?.user?.tenant?.id
      );
      const data = await this.BBCSConnectorService.fetchAccountGroupCodesData(
        tenantConfig
      );
      const groups = data?.groups;

      const [industry_category, collectionOperation] = await Promise.all([
        this.industryCategoriesRepository.find({
          where: {
            tenant_id: this?.request?.user?.tenant?.id,
            is_archive: false,
          },
          order: { id: 'DESC' },
          take: 1,
        }),
        this.businessUnitsRepository.find({
          where: {
            tenant_id: { id: this?.request?.user?.tenant?.id },
            is_archived: false,
          },
          order: { id: 'DESC' },
          take: 1,
        }),
      ]);

      const recruiter = await this.userRepository.find({
        where: {
          tenant: { id: this?.request?.user?.tenant?.id },
          role: { is_recruiter: true },
          business_unit: { id: collectionOperation?.[0]?.id },
          is_archived: false,
        } as any,
        relations: ['tenant', 'role', 'business_unit'],
        order: { id: 'DESC' },
        take: 1,
      });

      for (const group of groups) {
        const existing = await this.accountRepository.find({
          where: {
            BECS_code: group.code,
            is_active: true,
            is_archived: false,
            tenant_id: { id: this?.request?.user?.tenant?.id },
          } as any,
        });

        if (existing.length == 0) {
          const account = new Accounts();
          account.name = group.description;
          account.alternate_name = '';
          account.phone = '';
          account.website = '';
          account.facebook = '';
          account.industry_category = industry_category?.[0]?.id;
          account.industry_subcategory = null;
          account.stage = null;
          account.source = null;
          account.BECS_code = group.code;
          account.collection_operation = collectionOperation?.[0];
          account.recruiter = recruiter?.[0];
          account.territory = null;
          account.population = 0;
          account.is_active = true;
          account.RSMO = false;
          account.tenant_id = this.request?.user?.tenant?.id;
          account.created_by = this.request?.user;
          await this.entityManager.save(account);
        }
      }
      return resSuccess(
        'Accounts Synced from BBCS.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {}
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
    }
  }
}
