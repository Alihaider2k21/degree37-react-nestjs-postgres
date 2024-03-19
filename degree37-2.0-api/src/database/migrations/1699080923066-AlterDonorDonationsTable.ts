import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterDonorDonationsTable1699080923066
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(`donors_donations`);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(`donor_id`) !== -1
    );
    await queryRunner.dropForeignKey(`donors_donations`, foreignKey);

    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['donor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'donors',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donor_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(`donors_donations`);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(`donor_id`) !== -1
    );
    await queryRunner.dropForeignKey(`donors_donations`, foreignKey);

    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['donor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'donor',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donor_id',
      })
    );
  }
}
