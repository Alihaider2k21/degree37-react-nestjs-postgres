import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterBookingRulesScheduleLeadTime1698666312000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'booking_rules',
      'schedule_lock_lead_time',
      new TableColumn({
        name: 'schedule_lock_lead_time',
        type: 'int',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'booking_rules',
      'schedule_lock_lead_time',
      new TableColumn({
        name: 'schedule_lock_lead_time',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
