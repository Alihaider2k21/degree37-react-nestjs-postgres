import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyHourTable1694689802376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the daily_hour table
    await queryRunner.createTable(
      new Table({
        name: 'daily_hour',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mon_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'mon_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tue_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tue_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'wed_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'wed_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'thu_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'thu_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fri_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fri_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sat_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sat_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sun_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sun_latest_return_time',
            type: 'varchar',
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
          { name: 'is_current', type: 'boolean', isNullable: true },
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
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'daily_hour',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_hour',
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
    await queryRunner.dropForeignKey('daily_hour', 'FK_created_by');
    await queryRunner.dropForeignKey('daily_hour', 'FK_tenant_id');

    await queryRunner.dropTable('daily_hour');
  }
}
