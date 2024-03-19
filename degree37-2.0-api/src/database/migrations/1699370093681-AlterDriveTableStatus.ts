import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDriveTableStatus1699370093681 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        isNullable: true,
        default: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'drives',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        isNullable: true,
        default: true,
      })
    );
  }
}
