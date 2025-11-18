import { DroneRepository } from "../repositories/drone-repository";
import { DroneState } from "../types";

export class BatterySimulatorService {
  private droneRepo = new DroneRepository();
  private readonly DISCHARGE_RATE = 2;
  private readonly CHARGE_RATE = 2;
  private readonly MIN_BATTERY = 10;
  private readonly MAX_BATTERY = 100;

  async dischargeBatteries(): Promise<void> {
    const activeDrones = await this.droneRepo.repoInst
      .createQueryBuilder('drone')
      .where('drone.state != :idleState', { idleState: DroneState.IDLE })
      .getMany();

    if (activeDrones.length === 0) {
      console.log('⚡ No active drones to discharge');
      return;
    }

    let dischargedCount = 0;
    let criticalBatteryCount = 0;

    for (const drone of activeDrones) { 
      const currentBattery = Number(drone.batteryCapacity);
      let newBattery = currentBattery - this.DISCHARGE_RATE;
      
      if (newBattery < this.MIN_BATTERY) { 
        criticalBatteryCount++;
      } else {
        await this.droneRepo.update(drone.id, { batteryCapacity: newBattery });
        dischargedCount++;

        // Warning for low battery
        if (newBattery < 25) {
          console.log(`⚠️  Warning: Drone - ${drone.serialNumber} battery low: ${newBattery}%`);
        }
      }
      console.log(`🔋⬇️  ${drone.serialNumber} [${drone.state}]: ${currentBattery}% → ${newBattery}%`);
    }
    console.log(`⚡ Battery discharge completed: ${dischargedCount} drones discharged, ${criticalBatteryCount} drones already at allowed minimum battery capacity`);
  }

  async chargeBatteries(): Promise<void> {
    const idleDrones = await this.droneRepo.repoInst
      .createQueryBuilder('drone')
      .where('drone.state = :idleState', { idleState: DroneState.IDLE })
      .andWhere('drone.batteryCapacity < :maxBattery', { maxBattery: this.MAX_BATTERY })
      .getMany();
    
    if (idleDrones.length === 0) {
      console.log('🔌 No IDLE drones need charging (all fully charged or busy)');
      return;
    }

    let chargedCount = 0;
    let fullyChargedCount = 0;

    for (const drone of idleDrones) { 
      const currentBattery = Number(drone.batteryCapacity);
      let newBattery = currentBattery + this.CHARGE_RATE;

      if (newBattery >= this.MAX_BATTERY) {
        newBattery = this.MAX_BATTERY;
        fullyChargedCount++;
        console.log(`✅ Drone ${drone.serialNumber} fully charged!`);
      } else {
        chargedCount++;
      }
      await this.droneRepo.update(drone.id, { batteryCapacity: newBattery });
      console.log(`🔋⬆️  ${drone.serialNumber} [IDLE]: ${currentBattery}% → ${newBattery}%`);
    }
    console.log(`🔌 Battery charge completed: ${chargedCount} drones charging, ${fullyChargedCount} fully charged`);
  }
 }