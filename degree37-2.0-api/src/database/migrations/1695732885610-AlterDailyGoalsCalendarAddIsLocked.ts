import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDailyGoalsCalendarAddIsLocked1695732885610
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'daily_goals_calenders',
      new TableColumn({ name: 'is_locked', type: 'boolean', default: false })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'daily_goals_calenders',
      new TableColumn({ name: 'is_locked', type: 'boolean', default: false })
    );
  }
}
