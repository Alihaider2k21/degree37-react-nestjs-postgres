import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTenantsTable1693933776441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenant',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tenant_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tenant_domain',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'admin_domain',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tenant_code',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'tenant_timezone',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'allow_email',
            type: 'boolean',
            default: false,
          },
          {
            name: 'has_superadmin',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
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
      })
    );

    await queryRunner.createForeignKey(
      'tenant',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tenant', 'FK_created_by');

    await queryRunner.dropTable('tenant');
  }
}
