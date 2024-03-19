import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CrmLocationsSpecsOptionsTable1694700047793
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_locations_specs_options',
        columns: [
          ...genericColumns,
          {
            name: 'location_specs_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'specs_key',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'specs_value',
            type: 'boolean',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'crm_locations_specs_options',
      new TableForeignKey({
        columnNames: ['location_specs_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_locations_specs',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_locations_specs_options',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'crm_locations_specs_options',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'crm_locations_specs_options',
      'FK_location_specs_id'
    );
    // Then, drop the table
    await queryRunner.dropTable('crm_locations_specs_options');
  }
}
