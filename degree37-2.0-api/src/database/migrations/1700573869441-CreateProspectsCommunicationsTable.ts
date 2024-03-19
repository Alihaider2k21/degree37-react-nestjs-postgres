import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateProspectsCommunicationsTable1700573869441
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects_communications',
        columns: [
          ...genericColumns,
          { name: 'message_type', type: 'varchar', length: '150' },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'prospect_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'template_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'schedule_date',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'prospects_communications',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'prospects_communications',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'prospects_communications',
      new TableForeignKey({
        columnNames: ['prospect_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prospects',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('prospects_communications', 'created_by');
    await queryRunner.dropForeignKey('prospects_communications', 'tenant_id');
    await queryRunner.dropForeignKey('prospects_communications', 'prospect_id');
    // Then, drop the table
    await queryRunner.dropTable('prospects_communications');
  }
}
