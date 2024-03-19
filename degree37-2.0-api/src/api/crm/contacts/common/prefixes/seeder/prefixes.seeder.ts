import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Prefixes } from '../entities/prefixes.entity';

@Injectable()
export class PrefixesSeeder implements Seeder {
  constructor(
    @InjectRepository(Prefixes)
    private readonly prefixesRepository: Repository<Prefixes>
  ) {}

  async seed(): Promise<any> {
    try {
      // await this.prefixesRepository.query('DELETE FROM prefixes');
      // await this.prefixesRepository.query(
      //   'ALTER SEQUENCE prefixes_id_seq RESTART WITH 1'
      // );

      const prefixesData = [
        {
          description: 'Doctor',
          abbreviation: 'Dr',
        },
        {
          description: 'Father',
          abbreviation: 'Fr',
        },
        {
          description: 'Miss',
          abbreviation: 'Miss',
        },
        {
          description: 'Mister',
          abbreviation: 'Mr',
        },
        {
          description: 'Missus',
          abbreviation: 'Mrs',
        },
        {
          description: 'Ms',
          abbreviation: 'Ms',
        },
        {
          description: 'Reverend',
          abbreviation: 'Rev',
        },
      ];

      for (const data of prefixesData) {
        const templateExist = await this.prefixesRepository.findOne({
          where: { description: data.description },
        });
        if (!templateExist) {
          const prefixes = new Prefixes();
          prefixes.description = data.description;
          prefixes.abbreviation = data.abbreviation;
          prefixes.is_active = true;
          // prefixes.created_at = new Date();
          // prefixes.is_archived = null;
          await this.prefixesRepository.insert(prefixes);
        }
      }
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }

  async drop(): Promise<any> {
    return;
  }
}
