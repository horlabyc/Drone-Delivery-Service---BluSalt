import { Drone } from "../entities/drone";
import { DroneRepository } from "../repositories/drone-repository";
import { DroneState, IOptions, LoadMedicationDTO, RegisterDroneDTO } from "../types";
import { MedicationRepository } from '../repositories/medication-repository';
import { AppDataSource } from '../config/database';
import { DroneMedication } from '../entities/drone-medication';

export class DroneService {
  private droneRepo = new DroneRepository();
  private medicationRepo = new MedicationRepository();
  private droneMedicationRepo = AppDataSource.getRepository(DroneMedication);

  async registerDrone(data: RegisterDroneDTO): Promise<{ success: boolean, data?: Drone, error?: string }> {
    try {
      const existing = await this.droneRepo.findBySerialNumber(data.serialNumber);
      if (existing) {
        return {
          success: false,
          error: 'Drone with this serial number already exists'
        }
      }
      const drone = await this.droneRepo.create(data);
      return {
        success: true,
        data: drone
      }
    } catch (error) {
      console.error(`Error occured while creating drone: ${error}`)
      return {
        success: false,
        error: 'Unexpected error occured'
      }
    }
  }

  async loadDroneWithMedications(data: LoadMedicationDTO): Promise<{ success: boolean, data?: Drone, error?: string}> {
    let drone = await this.droneRepo.findById(data.droneId);
    if (!drone) {
      return { success: false, error: 'Drone does not exist on our records'}
    }
    if (drone.batteryCapacity < 25) {
      return { success: false, error: 'Drone battery level is below 25%. Drone cannot load!'}
    }
    if (drone.state !== DroneState.IDLE) {
      return { success: false, error: 'Drone is not available for loading'}
    }
    const medications = await this.medicationRepo.findByIds(data.medicationIds);
    if (medications.length !== data.medicationIds.length) {
      return { success: false, error: 'Some medications not found'}
    }

    const totalWeight = medications.reduce((sum, med) => sum + Number(med.weight), 0);
    if (totalWeight > Number(drone.weightLimit)) {
      return { success: false, error: `Total weight ${totalWeight}g exceeds drone limit ${drone.weightLimit}g`}
    }

    await this.droneRepo.update(drone.id, { state: DroneState.LOADING });

    for (const medication of medications) {
      await this.droneMedicationRepo.save({
        droneId: drone.id,
        medicationId: medication.id
      });
    }

    await this.droneRepo.update(drone.id, { state: DroneState.LOADED });

    drone = (await this.droneRepo.findById(drone.id))!;
    return { success: true, data: drone }
  }

  async getAllDrones(
    options: IOptions,
    filter: Record<string, any>
  ): Promise<{
    drones: Partial<Drone>[];
    total: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  }> {
    const page = options.page ? parseInt(options.page as string, 10) : 1; // Page number from query parameter
    const pageSize = options.pageSize ? parseInt(options.pageSize as string, 10) : 5; // Items per page from query parameter
    const { sortBy } = options;

    const query = this.droneRepo.repoInst
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

    const [drones, total] = await query.getManyAndCount();

    if (page !== undefined && pageSize !== undefined) {
      const totalPages = Math.ceil(total / pageSize);
      return { drones, total, page, pageSize, totalPages };
    }
    return { drones, total };
  }
}