import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRolesHistory1693934205845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the roles_history table
    await queryRunner.createTable(
      new Table({
        name: 'roles_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
          },
          {
            name: 'role_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the roles_history table
    await queryRunner.dropTable('roles_history');
  }
}
