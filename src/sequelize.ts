import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { FinancialRecord } from './models/FinancialRecord';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [FinancialRecord],
});

export default sequelize;









