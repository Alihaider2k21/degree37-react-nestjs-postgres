import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersTable1693933776440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            name: 'keycloak_username',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'unique_identifier',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
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
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_super_admin',
            type: 'boolean',
            default: false,
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
            type: 'bigint',
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
            name: 'tenant',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
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
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['assigned_manager'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the 'user' table and foreign keys
    await queryRunner.dropForeignKey('user', 'FK_assigned_manager');
    await queryRunner.dropForeignKey('user', 'FK_created_by');
    await queryRunner.dropForeignKey('user', 'FK_hierarchy_level');
    await queryRunner.dropForeignKey('user', 'FK_role');
    await queryRunner.dropForeignKey('user', 'FK_business_unit');
    await queryRunner.dropForeignKey('user', 'FK_tenant');

    await queryRunner.dropTable('user');
  }
}
