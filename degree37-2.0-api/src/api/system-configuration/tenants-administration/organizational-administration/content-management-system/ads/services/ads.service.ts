import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdsDto } from '../dto/create-ads.dto';
import { UpdateAdsDto } from '../dto/update-ads.dto';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { Ads } from '../entities/ads.entity';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdsHistory } from '../entities/ads-history.entity';
import {
  AdsHistoryInterface,
  AdsSearchInterface,
  AdsStatusInterface,
} from '../interface/ads.interface';
import { enumStatus } from '../enum/ads.enum';
import { resSuccess, resError } from '../../../../../helpers/response';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ads)
    private readonly adsRepository: Repository<Ads>,
    @InjectRepository(AdsHistory)
    private readonly adsHistoryRepository: Repository<AdsHistory>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {}

  async create(createAdsDto: CreateAdsDto) {
    try {
      if (createAdsDto?.display_order && createAdsDto?.display_order < 0) {
        throw new HttpException(
          `The display order can't be negative.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const user: any = await this.userRepository.findOne({
        where: { id: createAdsDto?.created_by },
        relations: ['tenant'],
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      console.log({ user });
      const tenant: any = await this.tenantRepository.findOneBy({
        id: user?.tenant?.id,
      });
      console.log({ tenant });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }
      const tenantId: any = +tenant?.id;
      // make unique in future on the base of client id
      const ad: any = await this.adsRepository.findOne({
        where: {
          display_order: createAdsDto?.display_order,
          ad_type: createAdsDto?.ad_type,
          tenant_id: {
            id: tenantId,
          },
        },
        relations: ['tenant_id'],
      });
      console.log({ ad });
      if (ad) {
        throw new HttpException(
          `Duplicate display order values are not allowed`,
          HttpStatus.BAD_REQUEST
        );
      }
      const advertiseData = await this.adsRepository.save({
        ...createAdsDto,
        tenant_id: tenant?.id,
      });
      // return resSuccess(
      //   'Device Type created successfully', // message
      //   SuccessConstants.SUCCESS,
      //   HttpStatus.CREATED,
      //   advertiseData,
      // );
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Ad created',
        status_code: HttpStatus.CREATED,
        data: advertiseData,
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async update(updateAdsDto: UpdateAdsDto) {
    try {
      if (updateAdsDto?.display_order && updateAdsDto?.display_order < 0) {
        throw new HttpException(
          `The display order can't be negative.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const adverisement = await this.adsRepository.findOne({
        where: {
          id: updateAdsDto?.id,
        },
        relations: ['created_by', 'tenant_id'],
      });

      if (!adverisement) {
        throw new HttpException(`Ad not found.`, HttpStatus.NOT_FOUND);
      }

      let adverisementData: any = {
        ...adverisement,
      };
      adverisementData = {
        ...adverisement,
        created_by: +adverisementData?.created_by?.id,
      };

      const user: any = await this.userRepository.findOne({
        where: { id: adverisementData?.created_by },
        relations: ['tenant'],
      });
      console.log({ user });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      console.log({ user });
      const tenant: any = await this.tenantRepository.findOneBy({
        id: user?.tenant?.id,
      });
      console.log({ tenant });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const updatedData = {
        ...adverisementData,
        ...updateAdsDto,
        created_by: +adverisementData?.created_by,
      };

      if (updateAdsDto?.display_order || updateAdsDto?.ad_type) {
        // make unique in future on the base of client id
        const ad = await this.adsRepository.findOne({
          where: {
            id: updateAdsDto?.id,
            display_order: updatedData?.display_order,
            ad_type: updatedData?.ad_type,
          },
        });

        if (ad) {
          const updatedAdvertisement = await this.adsRepository.update(
            { id: updateAdsDto?.id },
            {
              image_name: updatedData?.image_name,
              image_url: updatedData?.image_url,
              redirect_url: updatedData?.redirect_url,
              display_order: updatedData?.display_order,
              is_active: updatedData?.is_active,
              ad_type: updatedData?.ad_type,
              details: updatedData?.details,
            }
          );
          if (updatedAdvertisement?.affected) {
            const action = 'C';
            await this.updateAdsHistory(
              { ...adverisement, created_by: updateAdsDto?.updated_by },
              action
            );
            return {
              status: SuccessConstants.SUCCESS,
              message: 'Ad updated successfully',
              status_code: HttpStatus.CREATED,
              data: updatedData,
            };
          }
        } else {
          const ad = await this.adsRepository.findOne({
            where: {
              display_order: updateAdsDto?.display_order,
              ad_type: updateAdsDto?.ad_type,
            },
          });
          if (ad) {
            throw new HttpException(
              `Duplicate display order values are not allowed`,
              HttpStatus.BAD_REQUEST
            );
          } else {
            const updatedAdvertisement = await this.adsRepository.update(
              { id: updateAdsDto?.id },
              {
                image_name: updatedData?.image_name,
                image_url: updatedData?.image_url,
                redirect_url: updatedData?.redirect_url,
                display_order: updatedData?.display_order,
                is_active: updatedData?.is_active,
                ad_type: updatedData?.ad_type,
                details: updatedData?.details,
              }
            );
            if (updatedAdvertisement?.affected) {
              const action = 'C';
              await this.updateAdsHistory(
                { ...adverisement, created_by: updateAdsDto?.updated_by },
                action
              );
              return {
                status: SuccessConstants.SUCCESS,
                message: 'Ad updated successfully',
                status_code: HttpStatus.CREATED,
                data: updatedData,
              };
            }
          }
        }
      }
      const updatedAdvertisement = await this.adsRepository.update(
        { id: updateAdsDto?.id },
        {
          image_name: updatedData?.image_name,
          image_url: updatedData?.image_url,
          redirect_url: updatedData?.redirect_url,
          display_order: updatedData?.display_order,
          is_active: updatedData?.is_active,
          ad_type: updatedData?.ad_type,
          details: updatedData?.details,
        }
      );
      if (updatedAdvertisement?.affected) {
        const action = 'C';
        await this.updateAdsHistory(
          {
            ...adverisement,
            created_by: updateAdsDto?.updated_by,
            created_at: new Date(),
          },
          action
        );
        return {
          status: SuccessConstants.SUCCESS,
          message: 'Ad updated successfully',
          status_code: HttpStatus.CREATED,
          data: updatedData,
        };
      } else {
        throw new NotFoundException('Ad did not update');
      }
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async archiveAd(id: any, updatedBy: any) {
    try {
      const adToArchive = await this.adsRepository.findOne({
        where: { id },
      });

      if (!adToArchive) {
        throw new HttpException(`Ad not found.`, HttpStatus.NOT_FOUND);
      }

      if (adToArchive.is_archive === false) {
        adToArchive.is_archive = true;
        await this.adsRepository.save(adToArchive);

        const adArchived = await this.adsRepository.findOne({
          relations: ['created_by', 'tenant_id'],
          where: { id: id },
        });
        const action = 'D';
        await this.updateAdsHistory(
          { ...adArchived, created_by: updatedBy },
          action
        );
      } else {
        throw new HttpException(
          `Ad is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Ad Archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(adsInterface: AdsSearchInterface, user: any) {
    try {
      const sortBy = adsInterface?.sortBy;
      const sortOrder = adsInterface?.sortOrder;

      if ((sortBy && !sortOrder) || (sortOrder && !sortBy)) {
        return new HttpException(
          'When selecting sort sortOrder & sortBy is required.',
          HttpStatus.BAD_REQUEST
        );
      }

      const tenantId = user?.tenant?.id;
      const limit: number =
        adsInterface?.limit && adsInterface?.limit !== 'undefined'
          ? +adsInterface?.limit
          : +process.env.PAGE_SIZE ?? 10;

      const page = adsInterface?.page ? +adsInterface?.page : 1;
      const where = {
        is_archive: false,
        tenant_id: {
          id: tenantId,
        },
      };

      const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
      if (sortBy && sortOrder) {
        sorting[sortBy] = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      } else {
        sorting['id'] = 'DESC';
      }
      if (adsInterface?.image_name) {
        Object.assign(where, {
          image_name: ILike(`%${adsInterface?.image_name}%`),
        });
      }
      if (adsInterface?.is_active) {
        Object.assign(where, {
          is_active: adsInterface?.is_active,
        });
      }

      if (adsInterface?.ad_type) {
        Object.assign(where, {
          ad_type: adsInterface?.ad_type,
        });
      }

      const [advertisements, total] = await this.adsRepository.findAndCount({
        where,
        order: sorting,
        skip: (page - 1) * limit,
        take: limit,
      });
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Ads Fetched successfully',
        status_code: HttpStatus.CREATED,
        total_records: total,
        data: advertisements,
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async getAdsHistory(adsInterface: AdsHistoryInterface) {
    try {
      const limit: number = adsInterface?.limit
        ? +adsInterface?.limit
        : +process.env.PAGE_SIZE ?? 10;
      const page = adsInterface?.page ? +adsInterface?.page : 1;
      let condition = '';
      if (adsInterface?.id) {
        condition = `ad.id = ${adsInterface?.id} and`;
      }
      const offset = (page - 1) * limit;
      const advertisements = await this.adsHistoryRepository.query(`
    SELECT ad.id, ad.name, ad.image_name, ad.image_url,ad.redirect_url, ad.display_order, ad.is_active, ad.ad_type, ad.details, ad.created_at, ad.created_by, 
    ad_h.rowkey,ad_h.history_reason,  
    ad_h.id, ad_h.name as history_title, ad_h.image_name as history_image_name, ad_h.image_url as history_image_url,ad_h.redirect_url as history_redirect_url, ad_h.display_order as history_display_order, ad_h.is_active as history_status, ad_h.ad_type as history_type, ad_h.details as history_description, ad_h.created_at as history_created_at, ad_h.created_by as history_created_by
    FROM degree37.public.advertisement_history ad_h
    LEFT JOIN degree37.public.advertisement ad ON ad.id = ad_h.id
    WHERE  ${condition} ad_h.rowkey IS NOT NULL AND ad_h.history_reason IS NOT NULL and  ad_h.image_name is NOT NULL and ad_h.image_url  is NOT NULL and ad_h.is_active is not null and ad_h.ad_type is not null
    ORDER BY ad.created_at
      LIMIT ${limit} OFFSET ${offset}
    `);

      const total = await this.adsHistoryRepository.query(`
    SELECT COUNT(*) AS total
    FROM (
    SELECT ad.id AS advertisement_id, ad.name, ad.image_name, ad.image_url, ad.redirect_url, ad.display_order, ad.is_active, ad.ad_type, ad.details, ad.created_at, ad.created_by, 
        ad_h.rowkey, ad_h.history_reason,  
        ad_h.id AS history_id, ad_h.name as history_title, ad_h.image_name as history_image_name, ad_h.image_url as history_image_url, ad_h.redirect_url as history_redirect_url, ad_h.display_order as history_display_order, ad_h.is_active as history_status, ad_h.ad_type as history_type, ad_h.details as history_description, ad_h.created_at as history_created_at, ad_h.created_by as history_created_by
    FROM degree37.public.advertisement_history ad_h
    LEFT JOIN degree37.public.advertisement ad ON ad.id = ad_h.id
    WHERE ${condition} ad_h.rowkey IS NOT NULL 
        AND ad_h.history_reason IS NOT NULL 
        AND ad_h.image_name IS NOT NULL 
        AND ad_h.image_url IS NOT NULL 
        AND ad_h.is_active IS NOT NULL 
        AND ad_h.ad_type IS NOT NULL
    ORDER BY ad.created_at
    ) AS subquery;
    `);

      return {
        status: SuccessConstants.SUCCESS,
        message: 'Ads Fetched successfully',
        status_code: HttpStatus.CREATED,
        count: +total[0].total,
        data: advertisements,
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async updateAdStatus(adsStatusInterface: AdsStatusInterface) {
    try {
      const ads = await this.adsRepository.findOne({
        where: { id: adsStatusInterface?.id },
      });
      if (!ads) {
        throw new HttpException(`Ad not found.`, HttpStatus.NOT_FOUND);
      }
      const updateAdStatus = await this.adsRepository.update(
        { id: adsStatusInterface?.id },
        { is_active: adsStatusInterface.is_active }
      );
      if (updateAdStatus?.affected) {
        const ads = await this.adsRepository.findOne({
          where: { id: adsStatusInterface?.id },
        });
        return {
          status: SuccessConstants.SUCCESS,
          message: 'Ad Status Updated',
          status_code: HttpStatus.CREATED,
          data: ads,
        };
      } else {
        throw new NotFoundException('Ad with provided id did not update');
      }
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async getAd(id: any) {
    try {
      let ad: any = await this.adsRepository.findOne({
        where: { id },
        relations: ['created_by'],
      });
      if (!ad) {
        throw new HttpException(
          `Ad not found.`,

          HttpStatus.NOT_FOUND
        );
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.adsHistoryRepository,
        id,
        this.userRepository
      );

      ad = {
        ...ad,
        created_by: {
          id: ad.created_by.id,
          first_name: ad?.created_by?.first_name,
          last_name: ad?.created_by?.last_name,
        },
        ...modifiedData,
      };
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Ad Fetch Updated',
        status_code: HttpStatus.CREATED,
        data: ad,
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async deleteAd(id: any, updatedBy: any) {
    try {
      const ads = await this.adsRepository.findOne({
        where: {
          id: id,
        },
        relations: ['created_by'],
      });
      if (!ads) {
        throw new HttpException(`Ad not found.`, HttpStatus.NOT_FOUND);
      }
      const adsDelete = await this.adsRepository.delete(id);
      if (adsDelete?.affected) {
        const action = 'D';
        await this.updateAdsHistory({ ...ads, created_by: updatedBy }, action);
      }
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Ad Deleted Successfully',
        status_code: HttpStatus.CREATED,
        data: null,
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async updateAdsHistory(data: any, action: string) {
    try {
      const advertisementHistoryC = new AdsHistory();
      advertisementHistoryC.id = data?.id;
      advertisementHistoryC.image_name = data?.image_name;
      advertisementHistoryC.image_url = data?.image_url;
      advertisementHistoryC.redirect_url = data?.redirect_url;
      advertisementHistoryC.display_order = data?.display_order;
      advertisementHistoryC.is_active = data?.is_active;
      advertisementHistoryC.is_archive = data?.is_archive;
      advertisementHistoryC.ad_type = data?.ad_type;
      advertisementHistoryC.details = data?.details;
      advertisementHistoryC.tenant_id = data?.tenant_id?.id;
      advertisementHistoryC.created_by = data?.created_by;
      advertisementHistoryC.history_reason = 'C';

      await this.adsHistoryRepository.save(advertisementHistoryC);

      if (action === 'D') {
        const advertisementHistoryD = new AdsHistory();
        advertisementHistoryD.id = data?.id;
        advertisementHistoryD.image_name = data?.image_name;
        advertisementHistoryD.image_url = data?.image_url;
        advertisementHistoryD.redirect_url = data?.redirect_url;
        advertisementHistoryD.display_order = data?.display_order;
        advertisementHistoryD.is_active = data?.is_active;
        advertisementHistoryD.is_archive = data?.is_archive;
        advertisementHistoryD.ad_type = data?.ad_type;
        advertisementHistoryD.details = data?.details;
        advertisementHistoryD.tenant_id = data?.tenant_id?.id;
        advertisementHistoryD.created_by = data?.created_by;
        advertisementHistoryD.history_reason = 'D';

        await this.adsHistoryRepository.save(advertisementHistoryD);
      }
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }
}
