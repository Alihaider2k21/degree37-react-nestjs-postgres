import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAllHierarchyAccessColumnInUserHistory1701333873704
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const all_hierarchy_access = await queryRunner.hasColumn(
      'user_history',
      'all_hierarchy_access'
    );

    if (!all_hierarchy_access)
      await queryRunner.addColumn(
        'user_history',
        new TableColumn({
          name: 'all_hierarchy_access',
          type: 'boolean',
          default: false,
        })
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_history', 'all_hierarchy_access');
  }
}
