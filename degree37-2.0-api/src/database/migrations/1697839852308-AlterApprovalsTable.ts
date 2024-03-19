import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterApprovalsTable1697839852308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'approval',
      new TableColumn({
        name: 'id',
        type: 'bigint',
        isPrimary: true,
      }),
      new TableColumn({
        name: 'id',
        type: 'bigint',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'approval',
      new TableColumn({
        name: 'id',
        type: 'bigint',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
      new TableColumn({
        name: 'id',
        type: 'bigint',
        isPrimary: true,
      })
    );
  }
}
