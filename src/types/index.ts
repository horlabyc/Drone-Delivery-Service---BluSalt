export enum DroneModel {
  LIGHTWEIGHT = 'Lightweight',
  MIDDLEWEIGHT = 'Middleweight',
  CRUISERWEIGHT = 'Cruiserweight',
  HEAVYWEIGHT = 'Heavyweight'
}

export enum DroneState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RETURNING = 'RETURNING'
}

export interface RegisterDroneDTO {
  serialNumber: string;
  model: DroneModel;
  weightLimit: number;
  batteryCapacity: number;
}

export interface LoadMedicationDTO {
  droneId: string;
  medicationIds: string[];
}