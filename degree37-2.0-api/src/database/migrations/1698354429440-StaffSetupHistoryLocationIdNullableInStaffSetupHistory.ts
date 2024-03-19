import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class StaffSetupHistoryLocationIdNullableInStaffSetupHistory1698354429440
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'staff_setup_history',
      'location_type_id',
      new TableColumn({
        name: 'location_type_id',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'staff_setup_history',
      'location_type_id',
      new TableColumn({
        name: 'location_type_id',
        type: 'varchar',
        isNullable: false,
      })
    );
  }
}
