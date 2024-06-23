import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import sequelize from './sequelize'; // Import sequelize instance
import financialRecordRouter from './routes/financialRecordRoutes';

import 'dotenv/config'; // Import dotenv/config to load environment variables


const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('CONNECTED TO MYSQL DATABASE!!'))

  .catch((err: Error) => console.error('Failed to Connect to MySQL Database', err));

// Sync all models
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err: Error) => console.error('Failed to sync database', err));


// Define the home route
app.get('/', (req, res) => {
  res.send('Welcome to the Financial Records API');
});

app.use('/financial-record', financialRecordRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
