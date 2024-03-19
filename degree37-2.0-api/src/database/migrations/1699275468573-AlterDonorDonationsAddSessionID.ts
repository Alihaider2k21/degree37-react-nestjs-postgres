import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterDonorDonationsAddSessionID1699275468573
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.addColumn(
        'donors_donations',
        new TableColumn({
          name: 'sessions_id',
          type: 'bigint',
          isNullable: true,
        })
      ),
      queryRunner.query(
        'ALTER TABLE donors_donations ALTER COLUMN drive_id DROP NOT NULL;'
      ),
      queryRunner.query(
        'ALTER TABLE donors_donations ALTER COLUMN account_id DROP NOT NULL;'
      ),
    ]);
    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['sessions_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sessions',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donors_donations');
    const sessionsFK = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('sessions_id')
    );
    if (sessionsFK)
      await queryRunner.dropForeignKey('donors_donations', sessionsFK);
    await queryRunner.dropColumn('donors_donations', 'sessions_id');
    await Promise.all([
      queryRunner.query(
        'ALTER TABLE donors_donations ALTER COLUMN drive_id SET NOT NULL;'
      ),
      queryRunner.query(
        'ALTER TABLE donors_donations ALTER COLUMN account_id SET NOT NULL;'
      ),
    ]);
  }
}
