import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDailyGoalAllocationAddMonthYear1701333873707
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('daily_goals_allocations', [
      new TableColumn({
        name: 'month',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'year',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('daily_goals_allocations', [
      new TableColumn({
        name: 'month',
        type: 'int',
        isNullable: false,
      }),
      new TableColumn({
        name: 'year',
        type: 'int',
        isNullable: false,
      }),
    ]);
  }
}
