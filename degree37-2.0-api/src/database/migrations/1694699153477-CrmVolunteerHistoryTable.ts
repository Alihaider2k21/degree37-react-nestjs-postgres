import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CrmVolunteerHistoryTable1694699153477
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the crm_volunteer_history table
    await queryRunner.createTable(
      new Table({
        name: 'crm_volunteer_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          { name: 'prefix_id', type: 'int', isNullable: true },
          { name: 'suffix_id', type: 'int', isNullable: true },
          { name: 'title', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'employee',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'nick_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'timestamp',
            precision: 6,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'crm_volunteer_history',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('crm_volunteer_history', 'FK_tenant_id');
    // Drop the crm_volunteer_history table
    await queryRunner.dropTable('crm_volunteer_history');
  }
}
