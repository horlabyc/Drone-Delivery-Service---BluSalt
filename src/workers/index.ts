import { initBatteryCheckWorker, scheduleBatteryCheck } from './battery-check-worker';
import { initBatteryDischargeWorker, scheduleBatteryDischarge } from './battery-discharge-worker';
import { initBatteryChargeWorker, scheduleBatteryCharge } from './battery-charge-worker';
import { initDroneJourneyWorker, scheduleDroneJourney } from './drone-journey-worker';

export const initializeWorkers = async (): Promise<void> => {
  initBatteryCheckWorker();
  initBatteryDischargeWorker();
  initBatteryChargeWorker();
  initDroneJourneyWorker();

  await scheduleBatteryCheck();
  await scheduleBatteryDischarge();
  await scheduleBatteryCharge();
  await scheduleDroneJourney();

  console.log('All workers initialized and scheduled');
};

