import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPrimaryKeyInDriveCertifificationsTable1701251050286
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives_certifications',
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
    await queryRunner.dropColumn('drives_certifications', 'id');
  }
}
