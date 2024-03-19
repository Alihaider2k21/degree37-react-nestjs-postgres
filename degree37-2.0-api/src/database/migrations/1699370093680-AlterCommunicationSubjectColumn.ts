import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCommunicationSubjectColumn1699370093680
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'communications',
      'subject',
      new TableColumn({
        name: 'subject',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'communications',
      'subject',
      new TableColumn({
        name: 'subject',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
  }
}
