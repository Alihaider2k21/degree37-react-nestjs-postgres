import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBookingRulesTable1693934233452
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'booking_rules',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'third_rail_fields_date',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'third_rail_fields_hours',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'third_rail_fields_staffing_setup',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'third_rail_fields_projection',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'third_rail_fields_location',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'third_rail_fields_',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'current_lock_lead_time',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'current_lock_lead_time_eff_date',
            type: 'timestamp',
            precision: 6,
          },
          {
            name: 'schedule_lock_lead_time',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'schedule_lock_lead_time_eff_date',
            type: 'timestamp',
            precision: 6,
          },
          {
            name: 'maximum_draw_hours',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_draw_hours_allow_appt',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'oef_block_on_product',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'oef_block_on_procedures',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'location_quali_drive_scheduling',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'location_quali_expires',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'location_quali_expiration_period',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sharing_max_miles',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
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
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'booking_rules',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'booking_rules',
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
    await queryRunner.dropForeignKey('booking_rules', 'FK_tenant_id');
    await queryRunner.dropForeignKey('booking_rules', 'FK_created_by');
    // Drop the 'booking_rules' table
    await queryRunner.dropTable('booking_rules');
  }
}
