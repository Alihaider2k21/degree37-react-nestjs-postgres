import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateRoles1693934194158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'roles',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'description',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'is_active',
          type: 'boolean',
          default: false,
        },
        {
          name: 'is_archived',
          type: 'boolean',
          default: false,
        },
        {
          name: 'is_recruiter',
          type: 'boolean',
          default: false,
        },
        {
          name: 'created_by',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          precision: 6,
          default: `('now'::text)::timestamp(6) with time zone`,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    // // Add foreign keys
    await queryRunner.createForeignKey(
      'roles',
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
    await queryRunner.dropForeignKey('roles', 'FK_created_by');

    // Drop the table
    await queryRunner.dropTable('roles');
  }
}
