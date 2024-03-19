import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Suffixes } from '../entities/suffixes.entity';

@Injectable()
export class SuffixesSeeder implements Seeder {
  constructor(
    @InjectRepository(Suffixes)
    private readonly suffixes: Repository<Suffixes>
  ) {}

  async seed(): Promise<any> {
    try {
      // await this.suffixes.query('DELETE FROM suffixes');
      // await this.suffixes.query(
      //   'ALTER SEQUENCE suffixes_id_seq RESTART WITH 1'
      // );

      const suffixesData = [
        {
          description: 'Fifth',
          abbreviation: 'V',
        },
        {
          description: 'Fourth',
          abbreviation: 'IV',
        },
        {
          description: 'Junior',
          abbreviation: 'Jr',
        },
        {
          description: 'Second',
          abbreviation: 'II',
        },
        {
          description: 'Senior',
          abbreviation: 'Sr',
        },
        {
          description: 'Third',
          abbreviation: 'III',
        },
      ];

      for (const data of suffixesData) {
        const templateExist = await this.suffixes.findOne({
          where: { description: data.description },
        });
        // suffixes.created_at = new Date();
        // suffixes.is_archived = null;
        if (!templateExist) {
          const suffixes = new Suffixes();
          suffixes.description = data.description;
          suffixes.abbreviation = data.abbreviation;
          suffixes.is_active = true;
          await this.suffixes.insert(suffixes);
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
