import { AppDataSource } from "../config/database";
import { BatteryAuditLog } from "../entities/battery-audit-log";

export class BatteryAuditLogRepository {
  private repository = AppDataSource.getRepository(BatteryAuditLog);

  async create(logData: Partial<BatteryAuditLog>): Promise<BatteryAuditLog> {
    const log = this.repository.create(logData);
    return await this.repository.save(log);
  }

  async findByDroneId(droneId: string): Promise<BatteryAuditLog[]> {
    return await this.repository.find({
      where: { droneId },
      order: { checkedAt: 'DESC' },
      take: 100
    });
  }
}
