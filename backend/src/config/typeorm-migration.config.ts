import * as path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig();
const migrationDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [path.join(__dirname, '..', 'domain', 'database', 'entities', '*{.ts,.js}')],
  migrations: [path.join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  logging: true,
} as DataSourceOptions);

export default migrationDataSource;
