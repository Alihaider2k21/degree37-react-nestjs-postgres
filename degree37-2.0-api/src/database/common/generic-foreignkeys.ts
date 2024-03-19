import { TableForeignKey } from 'typeorm';

const genericForeignKeys: TableForeignKey[] = [
  new TableForeignKey({
    columnNames: ['created_by'],
    referencedColumnNames: ['id'],
    referencedTableName: 'user',
    onDelete: 'CASCADE',
  }),
];

export default genericForeignKeys;
