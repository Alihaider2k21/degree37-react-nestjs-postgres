import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './database/entities/entity';
import * as dotenv from 'dotenv';
import { migrations } from './api/seeders/migrations.seeder';
dotenv.config();

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'd37',
      entities,
      synchronize: false,
      logging: false,
    }),
    TypeOrmModule.forFeature([]),
  ],
}).run([migrations]);
