import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeamStaffHistoryTable1694524591813
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "team_staff_history" table
    await queryRunner.createTable(
      new Table({
        name: 'team_staff_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'team_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'staff_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'id',
            type: 'bigint',
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
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "team_staff_history" table
    await queryRunner.dropTable('team_staff_history');
  }
}
