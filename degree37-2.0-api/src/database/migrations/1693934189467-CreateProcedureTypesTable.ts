import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProcedureTypes1693934189467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'procedure_types',
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
          name: 'is_goal_type',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'is_archive',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'procedure_duration',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'is_generate_online_appointments',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'is_active',
          type: 'boolean',
          default: false,
          isNullable: false,
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
      'procedure_types',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'procedure_types',
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
    await queryRunner.dropForeignKey('procedure_types', 'FK_created_by');
    await queryRunner.dropForeignKey('procedure_types', 'FK_tenant_id');
    // Drop the table
    await queryRunner.dropTable('procedure_types');
  }
}
