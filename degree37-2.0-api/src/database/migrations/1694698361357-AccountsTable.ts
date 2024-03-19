import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AccountsTable1694698361357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
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
            name: 'alternate_name',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'mailing_address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'facebook',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'industry_category',
            type: 'bigint',
          },
          {
            name: 'industry_subcategory',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'stage',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'source',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'BECS_code',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'collection_operation',
            type: 'bigint',
          },
          {
            name: 'recruiter',
            type: 'bigint',
          },
          {
            name: 'territory',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'population',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'RSMO',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
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
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['stage'],
        referencedColumnNames: ['id'],
        referencedTableName: 'stages',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['territory'],
        referencedColumnNames: ['id'],
        referencedTableName: 'territory',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['industry_subcategory'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry_categories',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['source'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sources',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['recruiter'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['industry_category'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry_categories',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['collection_operation'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('accounts', 'FK_stage');
    await queryRunner.dropForeignKey('accounts', 'FK_territory');
    await queryRunner.dropForeignKey('accounts', 'FK_created_by');
    await queryRunner.dropForeignKey('accounts', 'FK_industry_subcategory');
    await queryRunner.dropForeignKey('accounts', 'FK_source');
    await queryRunner.dropForeignKey('accounts', 'FK_recruiter');
    await queryRunner.dropForeignKey('accounts', 'FK_industry_category');
    await queryRunner.dropForeignKey('accounts', 'FK_collection_operation');

    await queryRunner.dropTable('accounts');
  }
}
