import { AppDataSource } from "../config/database";
import { Drone } from "../entities/drone";
import { DroneState, IOptions } from "../types";

export class DroneRepository { 
  private repository = AppDataSource.getRepository(Drone);

  public repoInst = this.repository;

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

  async findAll(): Promise<Drone[]> {
    return await this.repository.find();
  }
  

  async getAllDrones(
    options: { page:number, pageSize: number, sortBy: string | undefined },
    filter: Record<string, any>
  ): Promise<[Drone[], number]> {
    const { page, pageSize, sortBy } = options
    const query = this.repository
      .createQueryBuilder('drones')
  
    if (page !== undefined && pageSize !== undefined) {
      query.skip((page - 1) * pageSize).take(pageSize);
    }

    if (sortBy === 'createdAt') {
      query.orderBy({ 'drones.createdAt': 'DESC' });
    } else if (sortBy === 'desc') {
      query.orderBy({ 'drones.createdAt': 'DESC' });
    } else if (sortBy === 'asc') {
      query.orderBy({ 'drones.createdAt': 'ASC' });
    } else {
      query.orderBy({ 'drones.createdAt': 'DESC' });
    }

    if (filter['dateFrom']) {
      query.andWhere('drones.createdAt >= :start_date', { start_date: filter['dateFrom'] });
    }

    if (filter['dateTo']) {
      query.andWhere('drones.createdAt <= :end_date', { end_date: filter['dateTo'] });
    }

    if (filter['model']) {
      query.andWhere('drones.model = :droneModel', { droneModel: filter['model'] });
    }

    if (filter['state']) {
      query.andWhere('drones.state = :droneState', { droneState: filter['state'] });
    }

    return await query.getManyAndCount();
  }

  async findAvailableForLoading(
    options: { page:number, pageSize: number, sortBy: string | undefined },
  ): Promise<[Drone[], number]> {
    const { page, pageSize, sortBy } = options;

    const query = this.repository
      .createQueryBuilder('drone')
      .where('drone.state = :state', { state: DroneState.IDLE })
      .andWhere('drone.batteryCapacity >= :minBattery', { minBattery: 25 })
    
    if (page !== undefined && pageSize !== undefined) {
      query.skip((page - 1) * pageSize).take(pageSize);
    }

    return await query.getManyAndCount();
  }
}