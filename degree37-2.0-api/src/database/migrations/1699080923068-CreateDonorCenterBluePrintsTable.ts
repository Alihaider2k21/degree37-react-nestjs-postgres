import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateDonorCenterBluePrintsTable1699080923068
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donor_center_blueprints',
        columns: [
          ...genericColumns,
          {
            name: 'donorcenter_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'Varchar(60)',
            isNullable: false,
          },
          {
            name: 'oef_products',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'oef_procedures',
            type: 'float',
            isNullable: false,
          },
          { name: 'is_default', type: 'boolean', default: false },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'monday', type: 'boolean', default: false },
          { name: 'tuesday', type: 'boolean', default: false },
          { name: 'wednesday', type: 'boolean', default: false },
          { name: 'thursday', type: 'boolean', default: false },
          { name: 'friday', type: 'boolean', default: false },
          { name: 'saturday', type: 'boolean', default: false },
          { name: 'sunday', type: 'boolean', default: false },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'donor_center_blueprints',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donor_center_blueprints',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donor_center_blueprints',
      new TableForeignKey({
        columnNames: ['donorcenter_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'facility',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('donor_center_blueprints', 'created_by');
    await queryRunner.dropForeignKey('donor_center_blueprints', 'tenant_id');
    await queryRunner.dropForeignKey(
      'donor_center_blueprints',
      'donorcenter_id'
    );

    // Then, drop the table
    await queryRunner.dropTable('donor_center_blueprints');
  }
}
