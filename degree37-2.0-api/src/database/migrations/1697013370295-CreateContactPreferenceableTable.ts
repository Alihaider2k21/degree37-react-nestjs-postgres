import { PolymorphicType } from '../../api/common/enums/polymorphic-type.enum';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateContactPreferenceableTable1697013370295
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ContactPreferences table
    await queryRunner.createTable(
      new Table({
        name: 'contact_preferences',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'contact_preferenceable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'contact_preferenceable_type',
            type: 'enum',
            enum: Object.values(PolymorphicType), // Use the enum values
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
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    // Define foreign key constraints
    await queryRunner.createForeignKey(
      'contact_preferences',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'contact_preferences',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.dropForeignKey('contact_preferences', 'FK_tenant_id');
    await queryRunner.dropForeignKey('contact_preferences', 'FK_created_by');

    // Drop the ContactPreferences table
    await queryRunner.dropTable('contact_preferences');
  }
}
