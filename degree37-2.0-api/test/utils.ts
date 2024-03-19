import { entities } from '../src/database/entities/entity';

export const testingModuleConfigs = () => {
  let options = {};
  const db_type = process.env.DB_TYPE || 'postgres';
  if (db_type === 'postgres') {
    options = {
      type: db_type,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.TEST_DB_NAME || '',
      entities,
      synchronize: true,
      logging: false,
      dropSchema: true,
    };
  }

  return options;
};
