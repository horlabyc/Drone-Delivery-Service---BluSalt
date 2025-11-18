import { Drone } from "../entities/drone";
import { DroneRepository } from "../repositories/drone-repository";
import { DroneState, LoadMedicationDTO, RegisterDroneDTO } from "../types";
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
}