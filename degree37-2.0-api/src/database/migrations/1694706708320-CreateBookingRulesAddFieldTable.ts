import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBookingRulesAddFieldTable1694706708320
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'booking_rules_add_field',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'add_field_id',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'booking_rules_id',
            type: 'bigint',
            isPrimary: true,
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
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'booking_rules_add_field',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'booking_rules_add_field',
      new TableForeignKey({
        columnNames: ['booking_rules_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'booking_rules',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the 'booking_rules_add_field' table
    await queryRunner.dropForeignKey(
      'booking_rules_add_field',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'booking_rules_add_field',
      'FK_booking_rules_id'
    );

    await queryRunner.dropTable('booking_rules_add_field');
  }
}
