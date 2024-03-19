import { ApprovalStatusEnum } from '../../api/operations-center/operations/drives/enums';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterSessionsTable1698876782112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('sessions');
    const columns = [
      new TableColumn({
        name: 'date',
        type: 'date',
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
        enum: Object.values(ApprovalStatusEnum).map((item) => item.toString()),
      }),
    ];
    if (!table.columns.find((column) => column.name === 'tenant_id'))
      columns.push(
        new TableColumn({
          name: 'tenant_id',
          type: 'bigint',
          isNullable: false,
        })
      );
    await queryRunner.clearTable('sessions');
    await queryRunner.addColumns('sessions', columns);
    await queryRunner.createForeignKeys('sessions', [
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
      new TableForeignKey({
        columnNames: ['donor_center_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'facility',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
      new TableForeignKey({
        columnNames: ['promotion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promotion_entity',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
      new TableForeignKey({
        columnNames: ['operation_status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_status',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('sessions');
    const foreignKeys = table.foreignKeys.filter(
      (fk) => !fk.columnNames.includes('created_by')
    );

    await queryRunner.dropForeignKeys(table, foreignKeys);
    await queryRunner.dropColumns(table, [
      'date',
      'tenant_id',
      'donor_center_id',
      'promotion_id',
      'operation_status_id',
      'collection_operation_id',
      'oef_products',
      'oef_procedures',
      'approval_status',
    ]);
  }
}
