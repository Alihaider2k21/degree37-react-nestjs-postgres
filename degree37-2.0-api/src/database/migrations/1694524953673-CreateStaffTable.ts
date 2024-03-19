import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffTable1694524953673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the staff table
    await queryRunner.createTable(
      new Table({
        name: 'staff',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'staff_prefix',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'staff_suffix',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'nick_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date_of_birth',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'mailing_address',
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
            name: 'county',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'classification',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
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
            name: 'updated_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['role'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff',
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
    await queryRunner.dropForeignKey('staff', 'FK_role');
    await queryRunner.dropForeignKey('staff', 'FK_created_by');
    await queryRunner.dropForeignKey('staff', 'FK_updated_by');
    await queryRunner.dropForeignKey('staff', 'FK_tenant_id');
    // Drop the staff table
    await queryRunner.dropTable('staff');
  }
}
