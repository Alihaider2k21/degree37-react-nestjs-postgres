import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCustomFieldsDataTable1695818591278
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'custom_fields_data',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'custom_field_datable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'field_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'custom_field_datable_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'field_data',
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
            name: 'created_by',
            type: 'bigint',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'custom_fields_data',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'custom_fields_data',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'custom_fields_data',
      new TableForeignKey({
        columnNames: ['field_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'custom_fields',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('custom_fields_data', 'created_by');
    await queryRunner.dropForeignKey('custom_fields_data', 'tenant_id');
    await queryRunner.dropForeignKey('custom_fields_data', 'field_id');

    // Then, drop the table
    await queryRunner.dropTable('custom_fields_data');
  }
}
