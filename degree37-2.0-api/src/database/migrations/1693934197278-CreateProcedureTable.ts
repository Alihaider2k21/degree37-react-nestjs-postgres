import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  Unique,
} from 'typeorm';

export class CreateProcedure1693934197278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'procedure',
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
          isUnique: true,
        },
        {
          name: 'procedure_type_id ',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'description',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'is_active',
          type: 'boolean',
        },
        {
          name: 'is_archive',
          type: 'boolean',
          default: false,
        },
        {
          name: 'external_reference',
          type: 'varchar',
          length: '255',
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
        {
          name: 'created_by',
          type: 'bigint',
          isNullable: false,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'procedure',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'procedure',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'procedure',
      new TableForeignKey({
        columnNames: ['procedure_type_id '],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('procedure', 'FK_tenant_id');
    await queryRunner.dropForeignKey('procedure', 'FK_created_by');
    await queryRunner.dropForeignKey('procedure', 'FK_procedure_type_id ');
    // Drop the table
    await queryRunner.dropTable('procedure');
  }
}
