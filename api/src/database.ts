import { DataSource } from 'typeorm';
import { Username } from './model';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './database.sqlite',
  entities: [Username],
  synchronize: true,
  logging: false,
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
}

export default AppDataSource;
