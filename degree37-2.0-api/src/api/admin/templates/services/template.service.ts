import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Templates } from '../entities/templates.entity';
import { GetTemplatesInterface } from '../interface/templates.interface';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Templates)
    private readonly templateRepository: Repository<Templates>
  ) {}

  async listOfTemplates(
    getAllTemplateInterface: GetTemplatesInterface
  ): Promise<any> {
    try {
      const limit: number = getAllTemplateInterface?.limit
        ? +getAllTemplateInterface?.limit
        : +process.env.PAGE_SIZE;
      const page = getAllTemplateInterface?.page
        ? +getAllTemplateInterface?.page
        : 1;
      const where = {};
      if (getAllTemplateInterface?.title) {
        Object.assign(where, {
          title: Like(`%${getAllTemplateInterface?.title}%`),
        });
      }
      const [records, count] = await this.templateRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        status: HttpStatus.OK,
        message: 'Templates Fetched Successfully',
        count: count,
        data: records,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findTemplate(id: bigint) {
    try {
      return await this.templateRepository.findOne({ where: { id: id } });
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
