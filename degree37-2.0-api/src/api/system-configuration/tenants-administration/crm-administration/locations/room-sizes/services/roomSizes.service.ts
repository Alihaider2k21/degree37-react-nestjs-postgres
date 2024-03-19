import { GetAllRoomSizesInterface } from './../interface/roomSizes.interface';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike } from 'typeorm';
import * as dotenv from 'dotenv';
import { CreateRoomSizeDto } from '../dto/create-room-sizes.dto';
import { RoomSize } from '../entity/roomsizes.entity';
import { RoomSizesHistory } from '../entity/roomSizesHistory.entity';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { resError, resSuccess } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { HistoryService } from '../../../../../../common/services/history.service';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

dotenv.config();
@Injectable()
export class RoomSizesService extends HistoryService<RoomSizesHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(RoomSize)
    private readonly roomRepository: Repository<RoomSize>,
    @InjectRepository(RoomSizesHistory)
    private readonly roomRepositoryHistory: Repository<RoomSizesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
    super(roomRepositoryHistory);
  }

  /* create room */
  async create(createRoomSizeDto: CreateRoomSizeDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await this.userRepository.findOneBy({
        id: createRoomSizeDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const roomSize: any = new RoomSize();
      roomSize.name = createRoomSizeDto?.name;
      roomSize.description = createRoomSizeDto?.description;
      roomSize.is_active = createRoomSizeDto?.is_active ?? true;
      roomSize.created_by = createRoomSizeDto?.created_by;
      roomSize.is_archived = false;
      roomSize.tenant = this.request.user?.tenant;
      const room = await this.roomRepository.save(roomSize);
      return resSuccess(
        'Room Created Successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        room
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  /* get all rooms */
  async getAllRoomSizes(
    getAllRoomSizesInterface: GetAllRoomSizesInterface,
    user: any
  ) {
    try {
      const limit = Number(getAllRoomSizesInterface?.limit);
      const page = Number(getAllRoomSizesInterface?.page);
      const is_active = getAllRoomSizesInterface?.status?.toLocaleLowerCase();
      const search = getAllRoomSizesInterface?.search;
      const getTotalPage = (totalData: number, limit: number) => {
        return Math.ceil(totalData / limit);
      };
      if (page <= 0) {
        throw new HttpException(
          `page must of positive integer`,
          HttpStatus.BAD_REQUEST
        );
      }
      const where: any = {};
      where.is_archived = false;
      if (is_active !== undefined) {
        where.is_active = is_active === 'true';
      }

      Object.assign(where, {
        tenant: { id: user?.tenant?.id },
      });

      if (search != undefined) {
        where.name = ILike(`%${search}%`);
      }
      const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
      if (
        getAllRoomSizesInterface?.sortName &&
        getAllRoomSizesInterface?.sortOrder
      ) {
        sorting[getAllRoomSizesInterface?.sortName] =
          getAllRoomSizesInterface?.sortOrder.toUpperCase() as 'ASC' | 'DESC';
      }
      const [records, count] = await this.roomRepository.findAndCount({
        where,
        take: limit,
        skip: (page - 1) * limit,
        order: sorting,
      });
      return {
        total_records: count,
        page_number: page,
        totalPage: getTotalPage(count, limit),
        data: records,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /* get by :id */
  async getRoom(id: any) {
    try {
      const RoomSize = await this.roomRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by'],
      });

      if (!RoomSize) {
        throw new NotFoundException('RoomSize not found');
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.roomRepositoryHistory,
        id,
        this.userRepository
      );

      return { ...RoomSize, ...modifiedData };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Room size getRoom >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /* archive room :id */
  async archiveRoom(id: any, updated_by: any, created_by: any) {
    const room = await this.roomRepository.findOne({
      where: { id, is_archived: false },
      relations: ['created_by'],
    });

    if (!room) {
      throw new NotFoundException('RoomSize not found');
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      //console.log({ room });
      await this.roomRepository.save({
        ...room,
        is_archived: true,
      });

      const roomSizeHistory = new RoomSizesHistory();
      Object.assign(roomSizeHistory, room);
      roomSizeHistory.history_reason = 'C';
      roomSizeHistory.created_by = updated_by;
      delete roomSizeHistory?.created_at;
      await this.createHistory(roomSizeHistory);
      roomSizeHistory.history_reason = 'D';
      await this.createHistory(roomSizeHistory);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Room Archived.',
        status_code: 204,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Room size getRoom >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  /* update room info */
  async updateRoomInfo(id: any, createRoomSizeDto: CreateRoomSizeDto) {
    const user = await this.userRepository.findOneBy({
      id: createRoomSizeDto?.created_by,
    });
    if (!user) {
      throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
    }
    const roomSize = await this.roomRepository.findOne({
      where: { id, is_archived: false },
      relations: ['created_by', 'tenant'],
    });
    if (!roomSize) {
      throw new HttpException(`Room Size not found.`, HttpStatus.NOT_FOUND);
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const dataToUpdate = {
        name: createRoomSizeDto?.name,
        description: createRoomSizeDto?.description,
        is_active: createRoomSizeDto?.is_active ?? true,
        is_archived: false,
        tenant: roomSize?.tenant?.id,
      };

      /* const resp = */ await this.roomRepository.update(
        { id: id },
        dataToUpdate as any
      );

      const roomSizeHistory = new RoomSizesHistory();
      Object.assign(roomSizeHistory, roomSize);
      roomSizeHistory.history_reason = 'C';
      roomSizeHistory.created_by = createRoomSizeDto?.updated_by;
      roomSizeHistory.tenant_id = roomSize?.tenant?.id;
      delete roomSizeHistory?.created_at;
      await this.createHistory(roomSizeHistory);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Changes Saved.',
        status_code: 204,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
