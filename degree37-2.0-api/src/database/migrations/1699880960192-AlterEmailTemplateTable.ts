import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterEmailTemplateTable1699880960192
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'email_template',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        length: '50',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'email_template',
      'template_type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['Donor', 'Admin', 'Staff'],
        default: `'Admin'`,
      })
    );

    await queryRunner.changeColumn(
      'email_template',
      'is_active',
      new TableColumn({
        name: 'status',
        type: 'boolean',
        default: true,
      })
    );

    await queryRunner.addColumn(
      'email_template',
      new TableColumn({
        name: 'variables',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'email_template',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'email_template',
      new TableColumn({
        name: 'is_archived',
        type: 'boolean',
        isNullable: false,
        default: false,
      })
    );

    await queryRunner.addColumn(
      'email_template',
      new TableColumn({
        name: 'created_by',
        type: 'bigint',
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('email_template', 'tenant_id');

    await queryRunner.dropColumn('email_template', 'name');
    await queryRunner.changeColumn(
      'email_template',
      'type',
      new TableColumn({
        name: 'template_type',
        type: 'enum',
        enum: ['Donor', 'Admin'],
        default: `'Admin'`,
      })
    );

    await queryRunner.changeColumn(
      'email_template',
      'status',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
      })
    );
    await queryRunner.dropColumn('email_template', 'variables');
    await queryRunner.dropColumn('email_template', 'is_archived');
    await queryRunner.dropColumn('email_template', 'created_by');
  }
}
