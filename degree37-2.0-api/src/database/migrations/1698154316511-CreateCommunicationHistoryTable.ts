import { MigrationInterface, QueryRunner, Table } from 'typeorm';

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
export class CreateCommunicationHistoryTable1698154316511
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'communications_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
          },
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
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'contacts_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'is_active', type: 'boolean', default: true },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Then, drop the table
    await queryRunner.dropTable('communications_history');
  }
}
