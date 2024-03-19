import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export enum communication_message_type_enum {
  Email = 'email',
  SMS = 'sms',
}

export enum communication_status_enum {
  NEW = 'new', // email and SMS CC Defined
  IN_PROGRESS = 'in_progress', // email and SMS CC Defined
  DELIVERED = 'delivered', // email and SMS
  BOUNCED = 'bounced', // email only
  BLOCKED = 'blocked', // email only
  DEFERRED = 'deferred', // email only
  FAILED = 'failed', // email and SMS
  SENT = 'sent', // SMS only
  UNDELIVERED = 'undelivered', // SMS only
}

export class CreateCommunicationTable1698151791827
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'communications',
        columns: [
          ...genericColumns,
          { name: 'communicationable_type', type: 'varchar', length: '255' },
          {
            name: 'communicationable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'message_type',
            type: 'enum',
            enum: Object.values(communication_message_type_enum),
          },
          {
            name: 'subject',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'message_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'template_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(communication_status_enum),
          },
          {
            name: 'status_detail',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'contacts_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'is_active', type: 'boolean', default: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'communications',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'communications',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'communications',
      new TableForeignKey({
        columnNames: ['contacts_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('communications', 'created_by');
    await queryRunner.dropForeignKey('communications', 'tenant_id');
    await queryRunner.dropForeignKey('communications', 'contacts_id');
    // Then, drop the table
    await queryRunner.dropTable('communications');
  }
}
