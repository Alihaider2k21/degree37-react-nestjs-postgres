import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterUpdateRoleIdAndNullableHistoryRelationInStaffConfigHistory1698351175407
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(`staff_config_history`);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(`role_id`) !== -1
    );
    await queryRunner.dropForeignKey(`staff_config_history`, foreignKey);

    await queryRunner.renameColumn(
      'staff_config_history',
      'role_id',
      'contact_role_id'
    );

    await queryRunner.createForeignKey(
      'staff_config_history',
      new TableForeignKey({
        columnNames: ['contact_role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts_roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_contact_role_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_config_history',
      'FK_contact_role_id'
    );

    await queryRunner.renameColumn(
      'staff_config_history',
      'contact_role_id',
      'role_id'
    );

    await queryRunner.createForeignKey(
      'staff_config_history',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_role_id',
      })
    );
  }
}
