import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMonthlyGoals1693934214098 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the monthly_goals table
    await queryRunner.createTable(
      new Table({
        name: 'monthly_goals',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'january',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'february',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'march',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'april',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'may',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'june',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'july',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'august',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'september',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'october',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'november',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'december',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_goal',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'procedure_type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'donor_center',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'recruiter',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
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
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'monthly_goals',
      new TableForeignKey({
        columnNames: ['procedure_type'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'monthly_goals',
      new TableForeignKey({
        columnNames: ['recruiter'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'monthly_goals',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'monthly_goals',
      new TableForeignKey({
        columnNames: ['donor_center'],
        referencedColumnNames: ['id'],
        referencedTableName: 'facility',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'monthly_goals',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('monthly_goals', 'FK_procedure_type');
    await queryRunner.dropForeignKey('monthly_goals', 'FK_recruiter');
    await queryRunner.dropForeignKey('monthly_goals', 'FK_donor_center');
    await queryRunner.dropForeignKey('monthly_goals', 'FK_created_by');
    await queryRunner.dropForeignKey('monthly_goals', 'FK_tenant_id');
    // Drop the monthly_goals table
    await queryRunner.dropTable('monthly_goals');
  }
}
