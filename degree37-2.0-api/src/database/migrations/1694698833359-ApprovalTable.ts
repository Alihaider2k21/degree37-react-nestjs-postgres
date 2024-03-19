import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Approval1694698833359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the approval table
    await queryRunner.createTable(
      new Table({
        name: 'approval',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true },
          { name: 'promotional_items', type: 'boolean', isNullable: true },
          { name: 'marketing_materials', type: 'boolean', isNullable: true },
          { name: 'tele_recruitment', type: 'boolean', isNullable: true },
          { name: 'email', type: 'boolean', isNullable: true },
          { name: 'sms_texting', type: 'boolean', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by_id', type: 'bigint', isNullable: false },
        ],
      })
    );

    // Create foreign key constraint for created_by
    await queryRunner.createForeignKey(
      'approval',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('approval', 'FK_created_by');
    // Drop the approval table
    await queryRunner.dropTable('approval');
  }
}
