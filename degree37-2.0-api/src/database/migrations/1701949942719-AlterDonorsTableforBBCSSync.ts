import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDonorsTableforBBCSSync1701949942719
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('donors', [
      new TableColumn({
        name: 'donor_number',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('donors', 'donor_number');
  }
}
