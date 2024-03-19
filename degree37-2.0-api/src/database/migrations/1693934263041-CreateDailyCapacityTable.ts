import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyCapacityTable1693934263041
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_capacity',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mon_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'mon_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tue_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tue_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wed_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wed_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'thur_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'thur_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fri_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fri_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sat_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sat_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sun_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sun_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'effective_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'is_current', type: 'boolean' },
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
      'daily_capacity',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_capacity',
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
    await queryRunner.createForeignKey(
      'daily_capacity',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_capacity',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.dropTable('daily_capacity');
  }
}
