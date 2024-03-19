import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffConfigHistoryTable1693934265395
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_config_history',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'staff_config_id',
            type: 'bigint',
          },
          {
            name: 'qty',
            type: 'int',
          },
          {
            name: 'lead_time',
            type: 'int',
          },
          {
            name: 'setup_time',
            type: 'int',
          },
          {
            name: 'breakdown_time',
            type: 'int',
          },
          {
            name: 'wrapup_time',
            type: 'int',
          },
          {
            name: 'role_id',
            type: 'bigint',
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
      'staff_config_history',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('staff_config_history', 'FK_role_id');

    await queryRunner.dropTable('staff_config_history');
  }
}
