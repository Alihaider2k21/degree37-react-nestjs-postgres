import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CrmLocationsSpecsTable1694700047791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_locations_specs',
        columns: [
          ...genericColumns,
          {
            name: 'location_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'room_size_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'elevator',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'inside_stairs',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'outside_stairs',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'electrical_note',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'special_instructions',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'crm_locations_specs',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_locations',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_locations_specs',
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
    await queryRunner.dropForeignKey('crm_locations_specs', 'FK_created_by');
    await queryRunner.dropForeignKey('crm_locations_specs', 'FK_location_id');
    // Then, drop the table
    await queryRunner.dropTable('crm_locations_specs');
  }
}
