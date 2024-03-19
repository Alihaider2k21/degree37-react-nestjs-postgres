import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserEvents1694022182028 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the user_events table
    await queryRunner.createTable(
      new Table({
        name: 'user_events',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'page_name',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'activity',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'browser',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar(30)',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar(60)',
            default: 'false',
          },
          {
            name: 'type',
            type: 'varchar(100)',
            isNullable: false,
          },
          {
            name: 'date_time',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
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
            isNullable: true,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'user_events',
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
    await queryRunner.dropForeignKey('user_events', 'FK_created_by');
    // Drop the user_events table
    await queryRunner.dropTable('user_events');
  }
}
