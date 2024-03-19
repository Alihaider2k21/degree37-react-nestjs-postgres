import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserHistory1693934208092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the user_history table
    await queryRunner.createTable(
      new Table({
        name: 'user_history',
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
            name: 'first_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'unique_identifier',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date_of_birth',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'home_phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'work_phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'work_phone_extension',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address_line_1',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address_line_2',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'mobile_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_manager',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'hierarchy_level',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'business_unit',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'assigned_manager',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'override',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'adjust_appointment_slots',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'resource_sharing',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'edit_locked_fields',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'account_state',
            type: 'boolean',
            default: true,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the user_history table
    await queryRunner.dropTable('user_history');
  }
}
