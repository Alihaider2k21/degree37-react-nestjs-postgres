import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class RemoveOperationStatusFromSchedule1702627803147
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('schedule', 'operation_status');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'schedule',
      new TableColumn({
        name: 'operation_status',
        type: 'bigint',
      })
    );
  }
}
