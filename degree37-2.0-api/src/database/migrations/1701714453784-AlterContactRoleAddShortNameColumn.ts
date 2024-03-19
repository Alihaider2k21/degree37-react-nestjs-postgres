import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterContactRoleAddShortNameColumn1701714453784
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the 'is_primary' column to the 'team_staff' table
    await queryRunner.addColumn(
      'contacts_roles',
      new TableColumn({
        name: 'short_name',
        type: 'varchar',
        length: '50',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'contacts_roles_history',
      new TableColumn({
        name: 'short_name',
        type: 'varchar',
        length: '50',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the 'is_primary' column from the 'team_staff' table
    await queryRunner.dropColumn('contacts_roles', 'short_name');
    await queryRunner.dropColumn('contacts_roles_history', 'short_name');
  }
}
