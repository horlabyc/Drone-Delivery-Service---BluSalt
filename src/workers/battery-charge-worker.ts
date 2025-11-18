import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { BatterySimulatorService } from "../services/batter-simulator-service";

const batteryChargeQueue = new Queue('battery-charge', {
  connection: redisConnection,
});

export const initBatteryChargeWorker = () => {
  const worker = new Worker(
    'battery-charge',
    async () => {
      const simulationService = new BatterySimulatorService();
      await simulationService.chargeBatteries();
    },
    {
      connection: redisConnection,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
    }
  );

  worker.on('completed', (job) => {
    console.log('🔋⬆️ Battery charge job completed');
  });

  worker.on('failed', (job, err) => {
    console.error('🔋⬆️ Battery charge job failed ❌:', err);
  });

  return worker;
};

export const scheduleBatteryCharge = async () => {
  const interval = parseInt(process.env.BATTERY_CHARGE_INTERVAL || '60000'); // 1mins
  
  const existing = await batteryChargeQueue.getRepeatableJobs();
  for (const job of existing) {
    console.log(`[BatteryCharge] Removing old repeat job: ${job.key}`);
    await batteryChargeQueue.removeRepeatableByKey(job.key);
  }

  await batteryChargeQueue.add(
    'charge-batteries',
    {},
    {
      repeat: {
        every: interval,
      },
    }
  );

  console.log(`🔋⬇️  Battery charging scheduled every ${interval}ms`);
};