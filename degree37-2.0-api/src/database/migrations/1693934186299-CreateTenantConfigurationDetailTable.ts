import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTenantConfigurationDetail1693934186299
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'tenant_configuration_detail',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'element_name',
          type: 'varchar',
          length: '60',
          isNullable: false,
        },
        {
          name: 'end_point_url',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'secret_key',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'secret_value',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          precision: 6,
          default: `('now'::text)::timestamp(6) with time zone`,
        },
        {
          name: 'tenant_id',
          type: 'bigint',
          isNullable: false, // Change to false if needed
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
      'tenant_configuration_detail',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'tenant_configuration_detail',
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
    await queryRunner.dropForeignKey(
      'tenant_configuration_detail',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'tenant_configuration_detail',
      'FK_tenant_id'
    );

    await queryRunner.dropTable('tenant_configuration_detail');
  }
}
