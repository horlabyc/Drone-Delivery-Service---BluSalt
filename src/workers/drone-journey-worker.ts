import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { DroneJourneyService } from '../services/drone-journey-service';

const droneJourneyQueue = new Queue('drone-journey', {
  connection: redisConnection,
});

export const initDroneJourneyWorker = () => {
  const worker = new Worker(
    'drone-journey',
    async () => {
      const journeyService = new DroneJourneyService();
      await journeyService.progressDroneJourneys();
    },
    {
      connection: redisConnection,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
    }
  );

  worker.on('completed', (job) => {
    console.log('🚁 Drone journey progression completed');
  });

  worker.on('failed', (job, err) => {
    console.error('❌ Drone journey job failed:', err);
  });

  return worker;
};

export const scheduleDroneJourney = async () => {
  const interval = parseInt(process.env.DRONE_JOURNEY_INTERVAL || '300000'); // 5mins
  
  await droneJourneyQueue.add(
    'progress-journeys',
    {},
    {
      repeat: {
        every: interval,
      },
    }
  );

  console.log(`🚁 Drone journey simulation scheduled every ${interval}ms`);
};