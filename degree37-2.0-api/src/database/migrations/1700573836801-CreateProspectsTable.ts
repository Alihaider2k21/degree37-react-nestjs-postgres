import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateProspectsTable1700573836801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects',
        columns: [
          ...genericColumns,
          { name: 'name', type: 'varchar', length: '255' },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },

          { name: 'is_active', type: 'boolean', default: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'prospects',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'prospects',
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
    await queryRunner.dropForeignKey('prospects', 'created_by');
    await queryRunner.dropForeignKey('prospects', 'tenant_id');
    // Then, drop the table
    await queryRunner.dropTable('prospects');
  }
}
