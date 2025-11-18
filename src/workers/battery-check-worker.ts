import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { BatteryAuditService } from '../services/battery-audit-service';

const batteryCheckQueue = new Queue('battery-check', {
  connection: redisConnection,
});

export const initBatteryCheckWorker = () => { 
  const worker = new Worker(
    'battery-check',
    async () => {
      const auditService = new BatteryAuditService();
      await auditService.checkAndLogBatteryLevels();
    },
    {
      connection: redisConnection,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
    }
  );

  worker.on('completed', () => {
    console.log('Battery check job completed');
  });

  worker.on('failed', (job, err) => {
    console.error('Battery check job failed:', err);
  });

  return worker;
}

export const scheduleBatteryCheck = async () => {
  const interval = parseInt(process.env.BATTERY_CHECK_INTERVAL || '60000');

  await batteryCheckQueue.add(
    'check-batteries',
    {},
    {
      repeat: {
        every: interval,
      },
    }
  );

  console.log(`Battery check scheduled every ${interval}ms`);
};
