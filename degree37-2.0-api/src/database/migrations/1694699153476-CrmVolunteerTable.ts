import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CrmVolunteerTable1694699153476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the crm_volunteer table
    await queryRunner.createTable(
      new Table({
        name: 'crm_volunteer',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'prefix_id', type: 'int', isNullable: true },
          { name: 'suffix_id', type: 'int', isNullable: true },
          { name: 'title', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'employee',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'nick_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'timestamp',
            precision: 6,
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
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'crm_volunteer',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_volunteer',
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
    await queryRunner.dropForeignKey('crm_volunteer', 'FK_created_by');
    await queryRunner.dropForeignKey('crm_volunteer', 'FK_tenant_id');
    // Drop the crm_volunteer table
    await queryRunner.dropTable('crm_volunteer');
  }
}
