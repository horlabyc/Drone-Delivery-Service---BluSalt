import { BatteryAuditLogRepository } from "../repositories/battery-audit-log-repository";
import { DroneRepository } from "../repositories/drone-repository";

export class BatteryAuditService {
  private auditRepo = new BatteryAuditLogRepository();
  private droneRepo = new DroneRepository();

  async checkAndLogBatteryLevels(): Promise<void> {
    const drones = await this.droneRepo.findAll();
    
    for (const drone of drones) {
      await this.auditRepo.create({
        droneId: drone.id,
        batteryLevel: drone.batteryCapacity
      });
    }

    console.log(`Battery audit completed for ${drones.length} drones at ${new Date().toISOString()}`);
  }

  async getDroneBatteryHistory(droneId: string) {
    return await this.auditRepo.findByDroneId(droneId);
  }
}