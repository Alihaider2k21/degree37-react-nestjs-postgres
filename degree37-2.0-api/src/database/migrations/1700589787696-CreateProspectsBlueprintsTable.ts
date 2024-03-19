import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateProspectsBlueprintsTable1700589787696
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects_blueprints',
        columns: [
          ...genericColumns,
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'prospect_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'blueprint_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'prospects_blueprints',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'prospects_blueprints',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'prospects_blueprints',
      new TableForeignKey({
        columnNames: ['prospect_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prospects',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'prospects_blueprints',
      new TableForeignKey({
        columnNames: ['blueprint_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('prospects_blueprints', 'created_by');
    await queryRunner.dropForeignKey('prospects_blueprints', 'tenant_id');
    await queryRunner.dropForeignKey('prospects_blueprints', 'prospect_id');
    await queryRunner.dropForeignKey('prospects_blueprints', 'blueprint_id');
    // Then, drop the table
    await queryRunner.dropTable('prospects_blueprints');
  }
}
