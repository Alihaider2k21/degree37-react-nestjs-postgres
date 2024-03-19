import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PolymorphicType } from '../../api/common/enums/polymorphic-type.enum';

export class CreateContactPreferenceableHistoryTable1697013843279
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ContactPreferencesHistory table
    await queryRunner.createTable(
      new Table({
        name: 'contact_preferences_history',
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
          {
            name: 'contact_preferenceable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'contact_preferenceable_type',
            type: 'enum',
            enum: Object.values(PolymorphicType),
            default: `'${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}'`,
            isNullable: true,
          },
          {
            name: 'is_optout_email',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'is_optout_sms',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'is_optout_push',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'is_optout_call',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'next_call_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
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
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the ContactPreferencesHistory table
    await queryRunner.dropTable('contact_preferences_history');
  }
}
