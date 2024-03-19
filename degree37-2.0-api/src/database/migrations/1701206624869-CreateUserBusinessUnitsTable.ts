import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserBusinessUnits1701206624869
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_business_units',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true },
          { name: 'user_id', type: 'bigint', isNullable: false },
          { name: 'business_unit_id', type: 'bigint', isNullable: false },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'user_business_units',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_user_id',
      })
    );

    await queryRunner.createForeignKey(
      'user_business_units',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedTableName: 'business_units',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_business_unit_id',
      })
    );

    await queryRunner.createForeignKey(
      'user_business_units',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_created_by_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user_business_units', 'FK_user_id');
    await queryRunner.dropForeignKey(
      'user_business_units',
      'FK_business_unit_id'
    );
    await queryRunner.dropForeignKey('user_business_units', 'FK_created_by_id');
    await queryRunner.dropTable('user_business_units');
  }
}
