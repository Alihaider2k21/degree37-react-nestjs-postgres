import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameShiftProjectionsStaffTable1695364675978
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'shifts_projetions_staff_history',
      'shifts_projections_staff_history'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'shifts_projections_staff_history',
      'shifts_projetions_staff_history'
    );
  }
}
