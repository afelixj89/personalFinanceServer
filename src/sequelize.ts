import { Sequelize } from 'sequelize-typescript';
import { FinancialRecord } from './models/FinancialRecord';

const sequelize = new Sequelize({
  database: 'your_database_name',
  dialect: 'mysql',
  username: 'your_database_username',
  password: 'your_database_password',
  models: [FinancialRecord], 
});

export default sequelize;
