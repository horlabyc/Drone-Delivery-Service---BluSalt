import { DroneRepository } from "../repositories/drone-repository";
import { DroneState } from "../types";

export class DroneJourneyService {
  private droneRepo = new DroneRepository();

  private nextDroneStateMap: Partial<Record<DroneState, DroneState>> = {
    [DroneState.LOADED]: DroneState.DELIVERING,
    [DroneState.DELIVERING]: DroneState.DELIVERED,
    [DroneState.DELIVERED]: DroneState.RETURNING,
    [DroneState.RETURNING]: DroneState.IDLE
  }

  async progressDroneJourneys(): Promise<void> {
    const activeDrones = await this.droneRepo.repoInst
      .createQueryBuilder('drone')
      .where('drone.state != :idleState', { idleState: DroneState.IDLE })
      .andWhere('drone.state != :loadingState', { loadingState: DroneState.LOADING })
      .getMany();
    
    if (!activeDrones.length) {
      console.log('⚡ No active drones to update');
      return;
    }

    for (const drone of activeDrones) {
      const currentState = drone.state;
      const nextState = this.nextDroneStateMap[currentState];

      if (nextState) {
        await this.droneRepo.update(drone.id, { state: nextState });
        console.log(`↔️ Drone ${drone.serialNumber} transitioned from ${currentState} to ${nextState}`);
      }
    }
  }
}