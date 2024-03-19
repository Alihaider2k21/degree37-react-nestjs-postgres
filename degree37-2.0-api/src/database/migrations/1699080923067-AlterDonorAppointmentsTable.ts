import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterDonorAppointmentsTable1699080923067
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(`donors_appointments`);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(`donor_id`) !== -1
    );
    await queryRunner.dropForeignKey(`donors_appointments`, foreignKey);

    await queryRunner.createForeignKey(
      'donors_appointments',
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
    const table = await queryRunner.getTable(`donors_appointments`);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(`donor_id`) !== -1
    );
    await queryRunner.dropForeignKey(`donors_appointments`, foreignKey);

    await queryRunner.createForeignKey(
      'donors_appointments',
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
