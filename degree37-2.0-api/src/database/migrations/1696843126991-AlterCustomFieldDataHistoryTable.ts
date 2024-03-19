import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCustomFieldDataHistoryTable1696843126991
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('custom_fields_data_history', [
      new TableColumn({
        name: 'is_archived',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('custom_fields_data_history', [
      new TableColumn({
        name: 'is_archived',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
      }),
    ]);
  }
}
