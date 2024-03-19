import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsSlotsHistoryTableUpdateDateToTimeStamp1699283191080
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_slots_history',
      new TableColumn({
        name: 'start_time',
        type: 'date',
        isNullable: false,
      }),
      new TableColumn({
        name: 'start_time',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      })
    );
    await queryRunner.changeColumn(
      'shifts_slots_history',
      new TableColumn({
        name: 'end_time',
        type: 'date',
        isNullable: false,
      }),
      new TableColumn({
        name: 'end_time',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_slots_history',
      new TableColumn({
        name: 'start_time',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      }),
      new TableColumn({
        name: 'start_time',
        type: 'date',
        isNullable: false,
      })
    );
    await queryRunner.changeColumn(
      'shifts_slots_history',
      new TableColumn({
        name: 'end_time',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      }),
      new TableColumn({
        name: 'end_time',
        type: 'date',
        isNullable: false,
      })
    );
  }
}
