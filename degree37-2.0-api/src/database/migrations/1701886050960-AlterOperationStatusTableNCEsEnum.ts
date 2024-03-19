import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterOperationStatusTableNCEsEnum1701886050960
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing columns
    await queryRunner.dropColumn('operations_status', 'applies_to');
    await queryRunner.dropColumn('operations_status_history', 'applies_to');

    // Add new columns
    await queryRunner.addColumn(
      'operations_status',
      new TableColumn({
        name: 'applies_to',
        type: 'enum',
        enum: [
          'Drives',
          'Sessions',
          'Accounts',
          'Locations',
          'Donor Centers',
          'Donors',
          'Staff',
          'Volunteers',
          'NCEs',
        ],
        isArray: true,
        default: `'{Drives}'`,
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'operations_status_history',
      new TableColumn({
        name: 'applies_to',
        type: 'enum',
        enum: [
          'Drives',
          'Sessions',
          'Accounts',
          'Locations',
          'Donor Centers',
          'Donors',
          'Staff',
          'Volunteers',
          'NCEs',
        ],
        isArray: true,
        default: `'{Drives}'`,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new columns
    await queryRunner.dropColumn('operations_status', 'applies_to');
    await queryRunner.dropColumn('operations_status_history', 'applies_to');

    // Recreate old columns
    await queryRunner.addColumn(
      'operations_status',
      new TableColumn({
        name: 'applies_to',
        type: 'enum',
        enum: [
          'Drives',
          'Sessions',
          'Accounts',
          'Locations',
          'Donor Centers',
          'Donors',
          'Staff',
          'Volunteers',
        ],
        isArray: true,
        default: `'{Drives}'`,
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'operations_status_history',
      new TableColumn({
        name: 'applies_to',
        type: 'enum',
        enum: [
          'Drives',
          'Sessions',
          'Accounts',
          'Locations',
          'Donor Centers',
          'Donors',
          'Staff',
          'Volunteers',
        ],
        isArray: true,
        default: `'{Drives}'`,
        isNullable: false,
      })
    );
  }
}
