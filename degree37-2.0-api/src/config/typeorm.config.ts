import { entities } from '../database/entities/entity';

export const typeormConfigs = () => {
  let options;
  const db_type = process.env.DB_TYPE || 'postgres';
  if (db_type === 'postgres') {
    options = {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'degree37',
      entities,
      synchronize: false,
      logging: false,
    };
  }

  return options;
};

export default typeormConfigs;
