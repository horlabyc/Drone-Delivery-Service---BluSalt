import httpStatus from 'http-status';
import { Drone } from "../entities/drone";
import { DroneRepository } from "../repositories/drone-repository";
import { RegisterDroneDTO } from "../types";
import ApiError from "../utils/api-error";

export class DroneService { 
  private droneRepo = new DroneRepository();

  async registerDrone(data: RegisterDroneDTO): Promise<{ success: boolean, data?: Drone, error?: string}> { 
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
}