import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DailyCapacityChangeIsCurrentNullable1695732885609
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'daily_capacity',
      new TableColumn({ name: 'is_current', type: 'boolean' }),
      new TableColumn({ name: 'is_current', type: 'boolean', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'daily_capacity',
      new TableColumn({
        name: 'is_current',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_current',
        type: 'boolean',
        isNullable: false,
      })
    );
  }
}
