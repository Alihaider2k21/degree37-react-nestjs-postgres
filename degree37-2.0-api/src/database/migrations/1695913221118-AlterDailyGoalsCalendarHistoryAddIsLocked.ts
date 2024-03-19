import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDailyGoalsCalendarHistoryAddIsLocked1695913221118
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.hasColumn(
      'daily_goals_calenders_history',
      'is_locked'
    );
    if (!exists) {
      await queryRunner.addColumn(
        'daily_goals_calenders_history',
        new TableColumn({ name: 'is_locked', type: 'boolean', default: false })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'daily_goals_calenders_history',
      new TableColumn({ name: 'is_locked', type: 'boolean', default: false })
    );
  }
}
