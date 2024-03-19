import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { EntityManager } from 'typeorm';

@Injectable()
export class migrations implements Seeder {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const filePath = path.join(__dirname, './tables.json');
    const dataFile = fs.readFileSync(filePath);
    const seedData = JSON.parse(dataFile);
    try {
      const queryRunner = this.entityManager.connection.createQueryRunner();
      for (let i = 0; i < seedData.length; i++) {
        const item = seedData[i];
        const tableName = Object.keys(item)[0];
        const fileName = Object.values(item)[0];
        const hasTable = await queryRunner.hasTable(tableName);
        console.log({ tableName, fileName, hasTable });
        if (hasTable) {
          await queryRunner.query(
            `INSERT INTO migrations (timestamp, name) VALUES(${new Date().getTime()}, '${fileName}')`
          );
        }
      }
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }

  async drop(): Promise<any> {
    try {
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }
}
