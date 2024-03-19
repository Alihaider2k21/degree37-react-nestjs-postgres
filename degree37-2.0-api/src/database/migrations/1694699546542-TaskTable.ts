import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export enum OwnerEnum {
  RECRUITERS = 'Recruiters',
  SCHEDULERS = 'Schedulers',
  LEADTELERECRUITER = 'Lead Telerecruiter',
}

export enum AppliesToEnum {
  ACCOUNTS = 'Accounts',
  LOCATIONS = 'Locations',
  DONORCENTERS = 'Donor Centers',
  DONORS = 'Donors',
  STAFF = 'Staff',
  VOLUNTEERS = 'Volunteers',
  DRIVES = 'Drives',
  SESSIONS = 'Sessions',
  NCES = 'NCEs',
}

export class TaskTable1694699546542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '60' },
          { name: 'description', type: 'text' },
          { name: 'owner', type: 'enum', enum: Object.values(OwnerEnum) },
          {
            name: 'applies_to',
            type: 'enum',
            enum: Object.values(AppliesToEnum),
          },
          { name: 'offset', type: 'int' },
          { name: 'collection_operation', type: 'varchar' },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: 'now()',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archive',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'task',
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
    await queryRunner.dropForeignKey('task', 'FK_created_by');
    await queryRunner.dropForeignKey('task', 'FK_tenant_id');

    await queryRunner.dropTable('task');
  }
}
