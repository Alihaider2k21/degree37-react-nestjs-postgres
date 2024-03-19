import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsPrimaryToTeamStaff1695364675974
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the 'is_primary' column to the 'team_staff' table
    await queryRunner.addColumn(
      'team_staff',
      new TableColumn({
        name: 'is_primary',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the 'is_primary' column from the 'team_staff' table
    await queryRunner.dropColumn('team_staff', 'is_primary');
  }
}
