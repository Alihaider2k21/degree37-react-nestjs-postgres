import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDriveRelatedTables1695364675979
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'drive_certifications',
      'drives_certifications'
    );
    await queryRunner.renameTable('drive_contacts', 'drives_contacts');
    await queryRunner.renameTable('drive_equipments', 'drives_equipments');

    await queryRunner.renameTable(
      'drive_certifications_history',
      'drives_certifications_history'
    );
    await queryRunner.renameTable(
      'drive_contacts_history',
      'drives_contacts_history'
    );
    await queryRunner.renameTable(
      'drive_equipments_history',
      'drives_equipments_history'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'drives_certifications',
      'drive_certifications'
    );
    await queryRunner.renameTable('drives_contacts', 'drive_contacts');
    await queryRunner.renameTable('drives_equipments', 'drive_equipments');

    await queryRunner.renameTable(
      'drives_certifications_history',
      'drive_certifications_history'
    );
    await queryRunner.renameTable('drives_contacts', 'drive_contacts_history');
    await queryRunner.renameTable(
      'drives_equipments',
      'drive_equipments_history'
    );
  }
}
