import { Sequelize } from 'sequelize-typescript';
import { FinancialRecord } from './models/FinancialRecord';

// Load environment variables from .env file
import { config } from 'dotenv';
config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  models: [FinancialRecord],
});

export default sequelize;
