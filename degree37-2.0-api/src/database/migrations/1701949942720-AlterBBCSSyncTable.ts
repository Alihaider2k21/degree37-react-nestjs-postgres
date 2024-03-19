import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterBBCSSyncTable1701949942720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('bbcs_data_syncs', [
      new TableColumn({
        name: 'is_running',
        type: 'boolean',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bbcs_data_syncs', 'is_running');
  }
}
