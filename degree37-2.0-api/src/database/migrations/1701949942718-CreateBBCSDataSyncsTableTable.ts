import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateBBCSDataSyncsTableTable1701949942718
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bbcs_data_syncs',
        columns: [
          ...genericColumns,
          {
            name: 'job_start',
            type: 'timestamp',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'job_end',
            type: 'timestamp',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'next_start',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'inserted_count',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_count',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'total_count',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'bbcs_data_syncs',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'bbcs_data_syncs',
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
    // Drop the foreign key constraints
    const table = await queryRunner.getTable('bbcs_data_syncs');
    const foreignKeyTenant = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('tenant_id') !== -1
    );
    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('created_by') !== -1
    );
    await queryRunner.dropForeignKey('bbcs_data_syncs', foreignKeyUser);
    await queryRunner.dropForeignKey('bbcs_data_syncs', foreignKeyTenant);

    // Drop the table
    await queryRunner.dropTable('bbcs_data_syncs');
  }
}
