import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsSlotsTableUpdateDateToTimeStamp1699283191080
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_slots',
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
      'shifts_slots',
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
      'shifts_slots',
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
      'shifts_slots',
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
