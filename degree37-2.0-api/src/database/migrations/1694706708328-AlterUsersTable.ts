import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterUsersTable1694706708328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['hierarchy_level'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizational_levels',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['role'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['business_unit'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['tenant'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user', 'FK_hierarchy_level');
    await queryRunner.dropForeignKey('user', 'FK_role');
    await queryRunner.dropForeignKey('user', 'FK_business_unit');
    await queryRunner.dropForeignKey('user', 'FK_tenant');
  }
}
