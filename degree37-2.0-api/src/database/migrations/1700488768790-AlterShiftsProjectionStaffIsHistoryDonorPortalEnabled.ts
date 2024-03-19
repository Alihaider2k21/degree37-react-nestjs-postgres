import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterShiftsProjectionStaffIsHistoryDonorPortalEnabled1700488768790
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'shifts_projections_staff_history',
      new TableColumn({
        name: 'is_donor_portal_enabled',
        type: 'boolean',
        isNullable: true,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'shifts_projections_staff_history',
      'is_donor_portal_enabled'
    );
  }
}
