import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterShiftsProjectionStaffIsDonorPortalEnabled1700218982896
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'shifts_projections_staff',
      new TableColumn({
        name: 'is_donor_portal_enabled',
        type: 'boolean',
        default: true,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'shifts_projections_staff',
      'is_donor_portal_enabled'
    );
  }
}
