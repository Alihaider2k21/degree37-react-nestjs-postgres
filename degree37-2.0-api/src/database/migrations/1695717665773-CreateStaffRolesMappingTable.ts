import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffRolesMappingTable1695717665773
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the staff_roles_mapping table
    await queryRunner.createTable(
      new Table({
        name: 'staff_roles_mapping',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
            name: 'is_primary',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'staff_id',
            type: 'bigint',
          },
          {
            name: 'role_id',
            type: 'bigint',
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'staff_roles_mapping',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'staff_roles_mapping',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_roles_mapping',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'staff_roles_mapping',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts_roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('staff_roles_mapping', 'FK_created_by');
    await queryRunner.dropForeignKey('staff_roles_mapping', 'FK_tenant_id');
    await queryRunner.dropForeignKey('staff_roles_mapping', 'FK_staff_id');
    await queryRunner.dropForeignKey('staff_roles_mapping', 'FK_role_id');
    // Drop the staff table
    await queryRunner.dropTable('staff_roles_mapping');
  }
}
