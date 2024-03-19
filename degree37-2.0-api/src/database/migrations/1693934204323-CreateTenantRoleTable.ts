import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateTenantRole1693934204323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the tenant_role table
    await queryRunner.createTable(
      new Table({
        name: 'tenant_role',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'role_id',
            type: 'bigint',
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
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'tenant_role',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'tenant_role',
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
    await queryRunner.dropForeignKey('tenant_role', 'FK_tenant_id');
    await queryRunner.dropForeignKey('tenant_role', 'FK_role_id');
    // Drop the tenant_role table and its foreign keys
    await queryRunner.dropTable('tenant_role');
  }
}
