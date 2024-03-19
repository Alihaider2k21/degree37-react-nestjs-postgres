import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProducts1693934191052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'products',
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
          isNullable: false,
        },
        {
          name: 'short_description',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'description',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'is_active',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'external_reference',
          type: 'varchar',
          length: '60',
          isNullable: true,
        },
        {
          name: 'tenant_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'is_archived',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          precision: 6,
          default: `('now'::text)::timestamp(6) with time zone`,
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          isNullable: false,
          default: 'now()',
        },
        {
          name: 'created_by',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'updated_by',
          type: 'bigint',
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'products',
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
    await queryRunner.dropForeignKey('products', 'FK_created_by');
    await queryRunner.dropForeignKey('products', 'FK_updated_id');
    await queryRunner.dropForeignKey('products', 'FK_tenant_id');

    // Drop the table
    await queryRunner.dropTable('products');
  }
}
