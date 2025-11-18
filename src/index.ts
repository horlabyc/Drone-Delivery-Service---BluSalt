import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorConverter, errorHandler } from './middleware/error-handler';
import { AppDataSource } from './config/database';
import { seedData } from './seeds/seed-data';
import router from './routes';
import { initBatteryCheckWorker, scheduleBatteryCheck } from './workers/battery-check-worker';
import { initBatteryDischargeWorker, scheduleBatteryDischarge } from './workers/battery-discharge-worker';
import { initBatteryChargeWorker, scheduleBatteryCharge } from './workers/battery-charge-worker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorConverter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    await seedData();
    console.log('Database seeded successfully');

    initBatteryCheckWorker();
    await scheduleBatteryCheck();
    console.log('Battery check worker initialized');

    initBatteryDischargeWorker();
    await scheduleBatteryDischarge();
    console.log('Battery discharge worker initialized');

    initBatteryChargeWorker();
    await scheduleBatteryCharge();
    console.log('Battery charge worker initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();