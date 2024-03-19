import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateFilterCriteria1696256011502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'filter_criteria',
        columns: [
          ...genericColumns,
          {
            name: 'application_code',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'code',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'display_order',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'criteria_type',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('filter_criteria');
  }
}
