import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTenantApplicationTable1694700351364
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenant_applications',
        columns: [
          {
            name: 'tenant_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'application_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
        ],
      })
    );

    // Define foreign key constraints

    await queryRunner.createForeignKey(
      'tenant_applications',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'tenant_applications',
      new TableForeignKey({
        columnNames: ['application_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'applications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'tenant_applications',
      new TableIndex({
        columnNames: ['tenant_id'],
      })
    );

    await queryRunner.createIndex(
      'tenant_applications',
      new TableIndex({
        columnNames: ['application_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey('tenant_applications', 'FK_tenant_id');
    await queryRunner.dropForeignKey(
      'tenant_applications',
      'FK_application_id'
    );

    // Drop the table
    await queryRunner.dropTable('tenant_applications');
  }
}
