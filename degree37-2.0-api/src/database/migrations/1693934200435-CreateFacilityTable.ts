import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateFacility1693934200435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'facility',
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
          name: 'code',
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
          type: 'bigint',
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
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'facility',
      new TableForeignKey({
        columnNames: ['collection_operation'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'facility',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'facility',
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
    await queryRunner.dropForeignKey('facility', 'FK_collection_operation');
    await queryRunner.dropForeignKey('facility', 'FK_tenant_id');
    await queryRunner.dropForeignKey('facility', 'FK_created_by');

    await queryRunner.dropTable('facility');
  }
}
