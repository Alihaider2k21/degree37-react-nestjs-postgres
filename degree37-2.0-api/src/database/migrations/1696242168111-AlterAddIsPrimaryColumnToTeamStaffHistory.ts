import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAddIsPrimaryColumnToTeamStaffHistory1696242168111
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'team_staff_history',
      new TableColumn({
        name: 'is_primary',
        type: 'boolean',
        default: false,
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('team_staff_history', 'is_primary');
  }
}
