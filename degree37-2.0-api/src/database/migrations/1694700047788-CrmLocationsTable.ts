import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';
export class CrmLocations1694700047788 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_locations',
        columns: [
          ...genericColumns,
          {
            name: 'name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'cross_street',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'floor',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'room',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'room_phone',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'site_contact_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'becs_code',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'site_type',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'qualification_status',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'crm_locations',
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
    await queryRunner.dropForeignKey('crm_locations', 'FK_created_by');

    await queryRunner.dropTable('crm_locations');
  }
}
