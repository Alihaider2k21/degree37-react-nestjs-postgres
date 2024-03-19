import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike } from 'typeorm';
import { BookingRules } from '../entities/booking-rules.entity';
import { BookingRulesDto } from '../dto/booking-rules.dto';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { BookingRulesAddField } from '../entities/booking_rules_add_field.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AuditFields } from '../../../audit-fields/entities/audit-fields.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable()
export class BookingRulesService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,

    @InjectRepository(BookingRules)
    private readonly bookingRulesRepository: Repository<BookingRules>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AuditFields)
    private readonly addFieldRepository: Repository<AuditFields>,

    @InjectRepository(BookingRulesAddField)
    private readonly bookingRulesAddFieldRepository: Repository<BookingRulesAddField>,

    private readonly entityManager: EntityManager
  ) {}

  async create(bookingRulesDto: BookingRulesDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.userRepository.findOneBy({
        id: bookingRulesDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      for (const addFieldId of bookingRulesDto?.third_rail_fields[0]
        ?.add_field_id_list) {
        // Validate product_id
        if (typeof addFieldId !== 'number') {
          throw new BadRequestException(
            'add_field_id must be an integer array'
          );
        }
      }

      let bookingRules;

      if (bookingRulesDto?.id) {
        bookingRules = await this.bookingRulesRepository.findOne({
          where: {
            id: bookingRulesDto?.id,
          },
        });
      } else {
        bookingRules = new BookingRules();
      }

      // Create the Booking Rules
      // // Set Procedure Types properties from createProcedureTypes
      bookingRules.third_rail_fields_ =
        bookingRulesDto?.third_rail_fields[0]?.status;
      bookingRules.third_rail_fields_date =
        bookingRulesDto?.third_rail_fields[0]?.date;
      bookingRules.third_rail_fields_hours =
        bookingRulesDto?.third_rail_fields[0]?.hours;
      bookingRules.third_rail_fields_staffing_setup =
        bookingRulesDto?.third_rail_fields[0]?.staffing_setup;
      bookingRules.third_rail_fields_projection =
        bookingRulesDto?.third_rail_fields[0]?.projection;
      bookingRules.third_rail_fields_location =
        bookingRulesDto?.third_rail_fields[0]?.location;
      bookingRules.current_lock_lead_time =
        bookingRulesDto?.CurrentLockLeadTimeDto[0]?.lead_time;
      bookingRules.current_lock_lead_time_eff_date =
        bookingRulesDto?.CurrentLockLeadTimeDto[0]?.effective_date;
      bookingRules.schedule_lock_lead_time =
        bookingRulesDto?.ScheduleLockLeadTimeDto[0]?.lead_time;
      bookingRules.schedule_lock_lead_time_eff_date =
        bookingRulesDto?.ScheduleLockLeadTimeDto[0]?.effective_date;
      bookingRules.maximum_draw_hours =
        bookingRulesDto?.MaximumDrawHoursDto[0]?.hours;
      bookingRules.maximum_draw_hours_allow_appt =
        bookingRulesDto?.MaximumDrawHoursDto[0]?.allow_appointment;
      bookingRules.oef_block_on_product =
        bookingRulesDto?.OefBlockOnDto[0]?.product;
      bookingRules.oef_block_on_procedures =
        bookingRulesDto?.OefBlockOnDto[0]?.procedures;
      bookingRules.location_quali_drive_scheduling =
        bookingRulesDto?.LocationQualificationDto[0]?.drive_scheduling;
      bookingRules.location_quali_expires =
        bookingRulesDto?.LocationQualificationDto[0]?.expires;
      bookingRules.location_quali_expiration_period =
        bookingRulesDto?.LocationQualificationDto[0]?.expiration_period;
      bookingRules.sharing_max_miles = bookingRulesDto?.sharing_max_miles;
      bookingRules.created_by = bookingRulesDto?.created_by;
      bookingRules.is_active = true;
      bookingRules.tenant_id = this.request?.user?.tenant?.id;

      // Save the Procedure Types entity
      const savedBookingRules = await queryRunner.manager.save(bookingRules);
      await queryRunner.commitTransaction();
      const savedBookingRulesId = BigInt(savedBookingRules.id);

      await this.bookingRulesAddFieldRepository
        .createQueryBuilder('booking_rules_add_field')
        .delete()
        .from('booking_rules_add_field')
        .where('booking_rules_id = :booking_rules_id', {
          booking_rules_id: savedBookingRulesId,
        })
        .execute();

      //Create and format the  entities
      const bookingRulesAuditFields: BookingRulesAddField[] =
        bookingRulesDto?.third_rail_fields[0]?.add_field_id_list.map(
          (itemId) => {
            const bookingRuleFields = new BookingRulesAddField();
            bookingRuleFields.add_field_id = itemId;
            bookingRuleFields.booking_rules_id = savedBookingRulesId;
            bookingRuleFields.created_by = bookingRulesDto?.created_by;
            return bookingRuleFields;
          }
        );

      // Save the ProceduresProducts entities in the bridge table
      await this.bookingRulesAddFieldRepository.save(bookingRulesAuditFields);

      return {
        status: 'success',
        response: 'Booking Rules Created Successfully',
        status_code: 201,
        data: savedBookingRules,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: any): Promise<any> {
    // try {
    let bookingRule;
    if (id > 0) {
      bookingRule = await this.bookingRulesRepository.findOne({
        where: { id: id, tenant_id: this.request?.user?.tenant?.id },
        relations: ['booking_rules_add_field.bookingRules'],
      });
    } else {
      bookingRule = await this.bookingRulesRepository.findOne({
        where: { tenant_id: this.request?.user?.tenant?.id },
        relations: ['booking_rules_add_field.bookingRules'],
        order: { id: 'DESC' },
      });
    }

    if (!bookingRule) {
      return new HttpException(
        'Booking Rule not found',
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Booking Rule Fetched Succesfuly',
      data: bookingRule,
    };

    // }catch {
    //   return new HttpException(
    //     'Internel Server Error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
