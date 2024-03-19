import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { CreateDonorDto } from '../dto/create-donor.dto';
import { Donor } from '../entities/donor.entity';
import { ApiResponse } from '../helpers/api-response/api-response';
dotenv.config();

@Injectable()
export class DonorService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>
  ) {}

  async createDonor(createDonorData: CreateDonorDto) {
    const donor = await this.donorRepository.findOne({
      where: {
        email: createDonorData.email,
      },
    });

    if (donor) {
      return new HttpException('Donor Already Exist', HttpStatus.BAD_REQUEST);
    }

    if (
      !createDonorData?.firstName ||
      createDonorData?.firstName.trim() === ''
    ) {
      return new HttpException(
        'First Name is required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (!createDonorData?.lastName || createDonorData?.lastName.trim() === '') {
      return new HttpException('Last Name is required', HttpStatus.BAD_REQUEST);
    }

    if (!/^[a-zA-Z]+$/.test(createDonorData?.firstName)) {
      return new HttpException(
        'Invalid First Name. Only alphabets are allowed.',
        HttpStatus.BAD_REQUEST
      );
    }

    if (!/^[a-zA-Z]+$/.test(createDonorData?.lastName)) {
      return new HttpException(
        'Invalid Last Name. Only alphabets are allowed.',
        HttpStatus.BAD_REQUEST
      );
    }
    const passwordHash = await bcrypt.hash(
      createDonorData.password,
      +process.env.BCRYPT_SALT_ROUNDS ?? 10
    );

    const newDonor = await this.donorRepository.save({
      ...createDonorData,
      password: passwordHash,
      first_name: createDonorData.firstName,
      last_name: createDonorData.lastName,
    });

    if (newDonor) {
      return ApiResponse.success(
        'Donor Created Successfully',
        HttpStatus.CREATED,
        newDonor
      );
    } else {
      return new HttpException(
        'Error Creating Donor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findDonorByEmail(email: string) {
    return this.donorRepository.findOne({
      where: {
        email: email,
        is_active: true,
      },
    });
  }
}
