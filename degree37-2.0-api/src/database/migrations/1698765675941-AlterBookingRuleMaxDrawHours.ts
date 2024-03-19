import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterBookingRuleMaxDrawHours1698765675941
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'booking_rules',
      'maximum_draw_hours',
      new TableColumn({
        name: 'maximum_draw_hours',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'booking_rules',
      'maximum_draw_hours',
      new TableColumn({
        name: 'maximum_draw_hours',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
