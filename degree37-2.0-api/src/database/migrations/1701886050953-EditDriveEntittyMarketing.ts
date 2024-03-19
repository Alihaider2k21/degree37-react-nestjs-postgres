import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EditDriveEntittyMarketing1701886050953
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'drives',
      new TableColumn({
        name: 'marketing_start_time',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_start_time',
        type: 'timestamp',
        isNullable: true,
      })
    );
    await queryRunner.changeColumn(
      'drives',
      new TableColumn({
        name: 'marketing_end_time',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_end_time',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'drives',
      new TableColumn({
        name: 'marketing_start_time',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_start_time',
        type: 'date',
        isNullable: true,
      })
    );
    await queryRunner.changeColumn(
      'drives',
      new TableColumn({
        name: 'marketing_end_time',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_end_time',
        type: 'date',
        isNullable: true,
      })
    );
  }
}
