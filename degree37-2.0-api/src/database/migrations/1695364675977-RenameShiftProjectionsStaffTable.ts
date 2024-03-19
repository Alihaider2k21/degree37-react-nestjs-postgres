import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameShiftProjectionsStaffTable1695364675977
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'shifts_projetions_staff',
      'shifts_projections_staff'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'shifts_projections_staff',
      'shifts_projetions_staff'
    );
  }
}
