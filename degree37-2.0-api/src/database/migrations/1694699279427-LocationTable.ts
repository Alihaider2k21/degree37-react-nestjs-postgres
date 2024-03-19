import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class LocationTable1694699279427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'physical_address', type: 'varchar', length: '100' },
          { name: 'zip_code', type: 'float' },
          { name: 'city', type: 'varchar', length: '100' },
          { name: 'state', type: 'varchar', length: '100' },
          { name: 'country', type: 'varchar', length: '100' },
          { name: 'cross_street', type: 'varchar', length: '100' },
          { name: 'floor', type: 'varchar', length: '100' },
          { name: 'room', type: 'varchar', length: '100' },
          { name: 'room_phone', type: 'varchar', length: '100' },
          { name: 'site_contact', type: 'bigint' },
          { name: 'BECS_code', type: 'float' },
          { name: 'site_type', type: 'bigint' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('locations');
  }
}
