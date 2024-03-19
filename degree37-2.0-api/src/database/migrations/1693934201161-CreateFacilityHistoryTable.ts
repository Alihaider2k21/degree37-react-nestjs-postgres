import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateFacilityHistory1693934201161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'facility_history',
      columns: [
        {
          name: 'rowkey',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'history_reason',
          type: 'varchar',
          length: '1',
          isNullable: false,
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'alternate_name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'city',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'state',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'country',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'physical_address',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'postal_code',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'phone',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'donor_center',
          type: 'boolean',
          default: false,
        },
        {
          name: 'staging_site',
          type: 'boolean',
          default: false,
        },
        {
          name: 'collection_operation',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'status',
          type: 'boolean',
          default: false,
        },
        {
          name: 'industry_category',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'industry_sub_category',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'is_archived',
          type: 'boolean',
          default: false,
        },
        {
          name: 'created_by',
          type: 'bigint',
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
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          precision: 6,
          default: 'now()',
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'facility_history',
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
    await queryRunner.dropForeignKey('facility_history', 'FK_created_by');

    await queryRunner.dropTable('facility_history');
  }
}
