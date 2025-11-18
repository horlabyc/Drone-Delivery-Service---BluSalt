import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { BatterySimulatorService } from "../services/batter-simulator-service";

const batteryDischargeQueue = new Queue('battery-discharge', {
  connection: redisConnection,
});

export const initBatteryDischargeWorker = () => {
  const worker = new Worker(
    'battery-discharge',
    async () => {
      const simulationService = new BatterySimulatorService();
      await simulationService.dischargeBatteries();
    },
    {
      connection: redisConnection,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
    }
  );

  worker.on('completed', (job) => {
    console.log('🔋⬇️  Battery discharge job completed');
  });

  worker.on('failed', (job, err) => {
    console.error('❌ Battery discharge job failed:', err);
  });

  return worker;
};

export const scheduleBatteryDischarge = async () => {
  const interval = parseInt(process.env.BATTERY_DISCHARGE_INTERVAL || '60000'); // 1mins
  
  const existing = await batteryDischargeQueue.getRepeatableJobs();
  for (const job of existing) {
    console.log(`[BatteryDischarge] Removing old repeat job: ${job.key}`);
    await batteryDischargeQueue.removeRepeatableByKey(job.key);
  }

  await batteryDischargeQueue.add(
    'discharge-batteries',
    {},
    {
      repeat: {
        every: interval,
      },
    }
  );

  console.log(`🔋⬇️  Battery discharge scheduled every ${interval}ms`);
};