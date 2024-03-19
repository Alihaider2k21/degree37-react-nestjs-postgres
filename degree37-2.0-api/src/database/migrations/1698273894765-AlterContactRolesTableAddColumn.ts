import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterContactRolesTableAddColumn1698273894765
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contacts_roles',
      new TableColumn({
        name: 'is_primary_chairperson',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'contacts_roles',
      new TableColumn({
        name: 'is_primary_chairperson',
        type: 'boolean',
        default: false,
      })
    );
  }
}
