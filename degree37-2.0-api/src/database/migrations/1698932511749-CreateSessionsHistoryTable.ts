import { ApprovalStatusEnum } from '../../api/operations-center/operations/drives/enums';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateSessionsHistoryTable1698932511749
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sessions_history',
        columns: [
          ...genericHistoryColumns,
          new TableColumn({
            name: 'date',
            type: 'date',
            isNullable: false,
          }),
          new TableColumn({
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          }),
          new TableColumn({
            name: 'donor_center_id',
            type: 'bigint',
            isNullable: false,
          }),
          new TableColumn({
            name: 'promotion_id',
            type: 'bigint',
            isNullable: false,
          }),
          new TableColumn({
            name: 'operation_status_id',
            type: 'bigint',
            isNullable: false,
          }),
          new TableColumn({
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          }),
          new TableColumn({
            name: 'oef_products',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
            isNullable: false,
          }),
          new TableColumn({
            name: 'oef_procedures',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
            isNullable: false,
          }),
          new TableColumn({
            name: 'approval_status',
            type: 'enum',
            enum: Object.values(ApprovalStatusEnum).map((item) =>
              item.toString()
            ),
          }),
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sessions_history', true, true);
  }
}
