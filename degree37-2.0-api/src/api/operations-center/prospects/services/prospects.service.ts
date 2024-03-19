import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { CreateProspectDto, ListProspectsDto } from '../dto/prospects.dto';
import { Drives } from '../../operations/drives/entities/drives.entity';
import { UserRequest } from 'src/common/interface/request';
import { REQUEST } from '@nestjs/core';
import { Prospects } from '../entities/prospects.entity';
import { ProspectsCommunications } from '../entities/prospects-communications.entity';
import { ProspectsBlueprints } from '../entities/prospects-blueprints.entity';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { resError } from 'src/api/system-configuration/helpers/response';

dotenv.config();
@Injectable()
export class ProspectsService {
  private readonly apiUrl = process.env.DAILY_STORY_COMMUNICATION_URL;

  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Prospects)
    private readonly prospectsRepository: Repository<Prospects>,
    @InjectRepository(ProspectsCommunications)
    private readonly prospectsCommunicationsRepository: Repository<ProspectsCommunications>,
    @InjectRepository(ProspectsBlueprints)
    private readonly prospectsBlueprintsRepository: Repository<ProspectsBlueprints>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    private readonly entityManager: EntityManager,
    private readonly httpService: HttpService
  ) {}

  async create(createProspectDto: CreateProspectDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const allBlueprints = await this.verifyDriveIds(
        createProspectDto?.blueprints_ids
      );
      const newProspect = new Prospects();
      newProspect.name = createProspectDto?.name;
      newProspect.description = createProspectDto?.description;
      newProspect.created_by = this.request?.user?.id;
      newProspect.is_active = createProspectDto.status;
      newProspect.tenant_id = this.request.user?.tenant;
      newProspect.is_archived = false;

      const savedProspect = await this.prospectsRepository.save(newProspect);

      const newProspectCommunication = new ProspectsCommunications();
      newProspectCommunication.message = createProspectDto?.message;
      newProspectCommunication.message_type = 'email';
      newProspectCommunication.prospect_id = savedProspect;
      newProspectCommunication.created_by = this.request?.user;
      newProspectCommunication.tenant_id = this.request.user?.tenant;
      newProspectCommunication.template_id = createProspectDto?.template_id;
      newProspectCommunication.is_archived = false;
      newProspectCommunication.schedule_date = new Date(
        createProspectDto?.schedule_date
      );

      const savedProspectCommunication =
        await this.prospectsCommunicationsRepository.save(
          newProspectCommunication
        );
      const getBlueprintsDetails = await this.listProspects(
        { getByIds: createProspectDto.blueprints_ids },
        this.request.user?.tenant?.id
      );
      const promises = [];
      for (const blueprint of allBlueprints) {
        const prospectsBlueprints = new ProspectsBlueprints();
        prospectsBlueprints.blueprint_id = blueprint as Drives;
        prospectsBlueprints.prospect_id = savedProspect;
        prospectsBlueprints.created_by = this.request?.user;
        prospectsBlueprints.tenant_id = this.request.user?.tenant;
        promises.push(
          this.prospectsBlueprintsRepository.save(prospectsBlueprints)
        );
      }
      await Promise.all(promises);

      if (getBlueprintsDetails instanceof HttpException) throw HttpException;

      const allFormattedEmails = [];

      for (const singleBlueprint of getBlueprintsDetails.data) {
        const resEmail = await this.addVariables(
          createProspectDto.message,
          singleBlueprint
        );
        allFormattedEmails.push(resEmail);
      }

      for (const singleEmail of allFormattedEmails) {
        await this.sendEmail(
          createProspectDto.template_id,
          singleEmail?.cp_email,
          { emailContent: singleEmail.message },
          createProspectDto.schedule_date,
          singleEmail.driveDate,
          singleEmail.locationName
        );
      }
      await queryRunner.commitTransaction();

      return {
        status: 'success',
        response: 'Prospect Created Successfully',
        status_code: 201,
        data: { savedProspect, savedProspectCommunication },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new HttpException(
        { message: ['Something went wrong'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }

  async listProspects(params: ListProspectsDto, tenant_id: number) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (params?.name) {
        Object.assign(where, {
          name: ILike(`%${params?.name}%`),
        });
      }

      if (params?.status) {
        Object.assign(where, {
          status: params?.status,
        });
      }

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });
      if (params?.getByIds)
        Object.assign(where, {
          id: In(params.getByIds),
        });

      const drives = this.drivesRepository
        .createQueryBuilder('drives')
        .leftJoin('drives.account', 'account')
        .leftJoin('drives.location', 'location')
        .leftJoin('drives.recuriter', 'user')
        .addSelect('drives.id', 'id')
        .addSelect(
          `(SELECT TO_CHAR((drives.date), 'MM-DD-YYYY'))`,
          'drive_date'
        )
        .addSelect('account.name', 'account_name')
        .addSelect('user.first_name', 'user_first_name')
        .addSelect('user.last_name', 'user_last_name')
        .addSelect('location.name', 'location_name')
        .addSelect('location.name', 'location_name')
        .addSelect(
          `(SELECT TO_CHAR(MAX(d.date), 'MM-DD-YYYY')
            FROM drives d
            WHERE d.account_id = drives.account_id
              AND d.location_id = drives.location_id
              AND d.is_blueprint = false
              AND d.id != drives.id
              AND DATE_TRUNC('day', d.date) >= drives.date
            ) as next_drive`
        )
        .addSelect(
          `(SELECT TO_CHAR(MIN(d.date), 'MM-DD-YYYY')
            FROM drives d
            WHERE d.account_id = drives.account_id
              AND d.location_id = drives.location_id
              AND d.is_blueprint = false
              AND d.id != drives.id
              AND DATE_TRUNC('day', d.date) <= DATE_TRUNC('day', drives.date)
          ) as last_drive`
        )
        .addSelect(
          `(SELECT CAST(AVG(sps.procedure_type_qty) AS INTEGER) || ' / ' || CAST(AVG(sps.product_yield) AS INTEGER) 
          FROM shifts_projections_staff sps JOIN shifts s ON sps.shift_id = s.id 
          WHERE s.shiftable_id = drives.id AND s.shiftable_type = 'DRIVES'
          ) as projection`
        )
        .addSelect(
          `(SELECT MAX(ac.created_at) 
          FROM account_contacts ac 
          WHERE ac.contactable_id = drives.account_id 
          AND ac.contactable_type = 'accounts'
          ) as latest_contact_created_at`
        )
        .addSelect(
          `(SELECT v.first_name || ' ' || v.last_name
             FROM crm_volunteer v 
             WHERE v.id = (SELECT ac.record_id 
              FROM account_contacts ac 
              WHERE ac.contactable_id = drives.account_id 
              AND ac.contactable_type = 'accounts' 
              AND ac.role_id IN (SELECT cr.id 
                  FROM contacts_roles cr 
                  WHERE cr.name ILIKE 'chairperson') 
              ORDER BY ac.created_at DESC LIMIT 1) 
          ) as cp_name`
        )
        .addSelect(
          `(SELECT v.first_name
             FROM crm_volunteer v
             WHERE v.id = (SELECT ac.record_id
              FROM account_contacts ac
              WHERE ac.contactable_id = drives.account_id
              AND ac.contactable_type = 'accounts'
              AND ac.role_id IN (SELECT cr.id
                  FROM contacts_roles cr
                  WHERE cr.name ILIKE 'chairperson')
              ORDER BY ac.created_at DESC LIMIT 1)
          ) as cp_first`
        )
        .addSelect(
          `(SELECT v.last_name
             FROM crm_volunteer v
             WHERE v.id = (SELECT ac.record_id
              FROM account_contacts ac
              WHERE ac.contactable_id = drives.account_id
              AND ac.contactable_type = 'accounts'
              AND ac.role_id IN (SELECT cr.id
                  FROM contacts_roles cr
                  WHERE cr.name ILIKE 'chairperson')
              ORDER BY ac.created_at DESC LIMIT 1)
          ) as cp_last`
        )
        .addSelect(
          `(SELECT v.id
             FROM crm_volunteer v
             WHERE v.id = (SELECT ac.record_id
              FROM account_contacts ac
              WHERE ac.contactable_id = drives.account_id
              AND ac.contactable_type = 'accounts'
              AND ac.role_id IN (SELECT cr.id
                  FROM contacts_roles cr
                  WHERE cr.name ILIKE 'chairperson')
              ORDER BY ac.created_at DESC LIMIT 1)
          ) as volunteer_id`
        )
        .addSelect(
          `(SELECT v.title
             FROM crm_volunteer v
             WHERE v.id = (SELECT ac.record_id
              FROM account_contacts ac
              WHERE ac.contactable_id = drives.account_id
              AND ac.contactable_type = 'accounts'
              AND ac.role_id IN (SELECT cr.id
                  FROM contacts_roles cr
                  WHERE cr.name ILIKE 'chairperson')
              ORDER BY ac.created_at DESC LIMIT 1)
          ) as cp_title`
        )
        .addSelect(
          `(SELECT c.data
            FROM contacts c 
            WHERE c.contactable_id = (SELECT v.id
                                      FROM crm_volunteer v 
                                      WHERE v.id = (SELECT ac.record_id 
                                                    FROM account_contacts ac 
                                                    WHERE ac.contactable_id = drives.account_id 
                                                      AND ac.contactable_type = 'accounts' 
                                                      AND ac.role_id IN (SELECT cr.id 
                                                                        FROM contacts_roles cr 
                                                                        WHERE cr.name ILIKE 'chairperson') 
                                                    ORDER BY ac.created_at DESC LIMIT 1)
                                      )
              AND c.contactable_type = 'crm_volunteer' 
              AND c.contact_type = 2
          ) as cp_mobile`
        )
        .addSelect(
          `(SELECT c.data
            FROM contacts c
            WHERE c.contactable_id = (SELECT v.id
                                      FROM crm_volunteer v
                                      WHERE v.id = (SELECT ac.record_id
                                                    FROM account_contacts ac
                                                    WHERE ac.contactable_id = drives.account_id
                                                      AND ac.contactable_type = 'accounts'
                                                      AND ac.role_id IN (SELECT cr.id
                                                                        FROM contacts_roles cr
                                                                        WHERE cr.name ILIKE 'chairperson')
                                                    ORDER BY ac.created_at DESC LIMIT 1)
                                      )
              AND c.contactable_type = 'crm_volunteer'
              AND c.contact_type = 4
              LIMIT 1
          ) as cp_email`
        )
        .andWhere({ ...where, is_archived: false, is_blueprint: true });
      if (!params?.getByIds) {
        drives.take(limit).skip((page - 1) * limit);
      }
      const data = await drives.getRawMany();

      return {
        status: HttpStatus.OK,
        message: 'Build Segments Fetched Successfully',
        count: 0,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addVariables(inputData: any, dataBlueprint: any) {
    const createRegexPattern = (placeholder: string) => {
      const escapedPlaceholder = placeholder.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      );
      const regexPattern = `<${escapedPlaceholder}>`;
      return new RegExp(regexPattern, 'g');
    };

    const replacePlaceholders = (
      inputString: string,
      replacements: { [key: string]: string }
    ) => {
      const keys = Object.keys(replacements);
      const patterns = keys.map(createRegexPattern);

      let replacedString = inputString;
      keys.forEach((key, index) => {
        replacedString = replacedString.replace(
          patterns[index],
          replacements[key]
        );
      });

      return replacedString;
    };
    const replacedData = replacePlaceholders(inputData, {
      next_drive_date: dataBlueprint.next_drive,
      last_eligible_date: dataBlueprint.last_drive,
      account_name: dataBlueprint.account_name,
      cp_last: dataBlueprint.cp_last,
      cp_first: dataBlueprint.cp_first,
      cp_title: dataBlueprint.cp_title,
      recruiter:
        dataBlueprint.user_first_name.trim() +
        ' ' +
        dataBlueprint.user_last_name.trim(),
    });
    return {
      message: replacedData,
      cp_email: dataBlueprint.cp_email,
      driveDate: dataBlueprint.drive_date,
      locationName: dataBlueprint.location_name,
    };
  }
  async sendEmail(
    templateId: any,
    email: any,
    data: any,
    schedule_date: any,
    drive_date: any,
    location: any
  ) {
    try {
      const url = `${this.apiUrl}/email/send/${templateId}?email=${email}`;
      const token = process.env.DAILY_STORY_API_TOKEN;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response: AxiosResponse<any> = await this.httpService
        .post(
          url,
          {
            messageType: 'email',
            subject: `Blood Donation Drive ${drive_date} , ${location}`,
            OperationType: 'Schedule',
            OperationDate: schedule_date,
            message_text: data?.emailContent,
          },
          { headers }
        )
        .toPromise();

      // SCHEDULE PART NEEDED TO BE DISCUSSED BY DAILYSTORY

      // const response: AxiosResponse<any> = await this.httpService
      // .post(
      //   url,
      //   {
      //     contactMethod: 'SendEmail',
      //     messageType: 'email',
      //     subject: `Blood Donation Drive ${drive_date} , ${location}`,
      //     dateSchedule: new Date(schedule_date),
      //     message_text: data?.emailContent,
      //     segment: [0],
      //     campaignId: process.env.DAILY_STORY_CAMPAIGN_ID,
      //     messageId: templateId,
      //     excludes: [20426],
      //     send_window_hours: null,
      //   },
      //   { headers }
      // )
      // .toPromise();

      return response?.data;
    } catch (error) {
      console.log(error);

      if (!error.response?.data?.Status) {
        return resError(
          error.response.data?.Message,
          ErrorConstants.Error,
          error.status
        );
      }
    }
  }

  async verifyDriveIds(blueprintIds: bigint[]): Promise<any> {
    const blueprints = [];

    for (const id of blueprintIds) {
      const bluePrint = await this.drivesRepository.findOne({
        where: {
          id,
          tenant: { id: this.request?.user?.tenant?.id },
          is_blueprint: true,
        },
      });
      if (!bluePrint) {
        throw new BadRequestException(
          `Drive blueprint with id ${id} not found`
        );
      } else blueprints.push(bluePrint);
    }
    return blueprints;
  }
}
