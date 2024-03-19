import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOperationsStatusTable1693934234990
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'operations_status',
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
            length: '60',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'chip_color',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'applies_to',
            type: 'enum',
            enum: [
              'Drives',
              'Sessions',
              'Accounts',
              'Locations',
              'Donor Centers',
              'Donors',
              'Staff',
              'Volunteers',
            ],
            isArray: true,
            default: `'{Drives}'`,
            isNullable: false,
          },
          {
            name: 'schedulable',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'hold_resources',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'contribute_to_scheduled',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'requires_approval',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'operations_status',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'operations_status',
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
    await queryRunner.dropForeignKey('operations_status', 'FK_created_by');
    await queryRunner.dropForeignKey('operations_status', 'FK_tenant_id');
    // Drop the 'operations_status' table
    await queryRunner.dropTable('operations_status');
  }
}
