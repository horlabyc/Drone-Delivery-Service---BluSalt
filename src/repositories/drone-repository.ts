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

  async findById(id: string): Promise<Drone | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Drone>): Promise<Drone | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }
}