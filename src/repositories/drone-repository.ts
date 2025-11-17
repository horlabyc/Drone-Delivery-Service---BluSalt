import { AppDataSource } from "../config/database";
import { Drone } from "../entities/drone";

export class DroneRepository { 
  private repository = AppDataSource.getRepository(Drone);

  async create(droneData: Partial<Drone>): Promise<Drone> {
    const drone = this.repository.create(droneData);
    return await this.repository.save(drone);
  }

  async findBySerialNumber(serialNumber: string): Promise<Drone | null> {
    return await this.repository.findOne({ where: { serialNumber } });
  }
}