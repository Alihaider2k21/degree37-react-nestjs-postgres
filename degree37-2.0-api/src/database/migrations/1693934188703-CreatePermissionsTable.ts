import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePermissions1693934188703 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'permissions',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'code',
          type: 'varchar',
          length: '255',
          isNullable: true,
        },
        {
          name: 'is_super_admin_permission',
          type: 'boolean',
          default: false,
        },
        {
          name: 'module_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'application_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          precision: 6,
          default: `('now'::text)::timestamp(6) with time zone`,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'permissions',
      new TableForeignKey({
        columnNames: ['application_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'applications',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'permissions',
      new TableForeignKey({
        columnNames: ['module_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'modules',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('permissions', 'FK_application_id');
    await queryRunner.dropForeignKey('permissions', 'FK_module_id');

    // Drop the table
    await queryRunner.dropTable('permissions');
  }
}
