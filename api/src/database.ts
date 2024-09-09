import { DataSource } from 'typeorm';
import { Username } from './model';
import * as mysql from 'mysql2/promise';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  username: process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'repo-ranger',
  entities: [Username],
  synchronize: true,
  logging: false,
});

export async function initializeDatabase() {
  const dbName = process.env.MYSQL_DATABASE || 'repo-ranger';

  try {
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || 'localhost',
      port: parseInt(process.env.MYSQLPORT || '3306'),
      user: process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || 'password',
    });

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    // Initialize the TypeORM connection
    await AppDataSource.initialize();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
}

export default AppDataSource;
