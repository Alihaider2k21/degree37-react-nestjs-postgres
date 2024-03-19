import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateIndustryCategoriesTable1693934227193
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'industry_categories',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'parent_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'minimum_oef',
            type: 'double precision',
            isNullable: true,
          },
          {
            name: 'maximum_oef',
            type: 'double precision',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
            isNullable: false,
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
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'is_archive',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'industry_categories',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry_categories',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'industry_categories',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'industry_categories',
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
    // Drop the foreign key constraints first
    await queryRunner.dropForeignKey('industry_categories', 'FK_parent_id');
    await queryRunner.dropForeignKey('industry_categories', 'FK_created_by');
    await queryRunner.dropForeignKey('industry_categories', 'FK_tenant_id');
    // Drop the 'industry_categories' table
    await queryRunner.dropTable('industry_categories');
  }
}
