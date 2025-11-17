import { AppDataSource } from "../config/database"
import { Drone } from "../entities/drone"
import { Medication } from "../entities/medication";
import { DroneModel, DroneState } from "../types";

export const seedData = async () => {
  const droneRepo = AppDataSource.getRepository(Drone)
  const medicationRepo = AppDataSource.getRepository(Medication); 

  const droneCount = await droneRepo.count({ take: 10 });
  if (droneCount === 0) {
    const drones = [
      {
        serialNumber: 'DRN-001-LW',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 125,
        batteryCapacity: 100,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-002-LW',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 125,
        batteryCapacity: 85,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-003-MW',
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: 250,
        batteryCapacity: 90,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-004-MW',
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: 250,
        batteryCapacity: 75,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-005-CW',
        model: DroneModel.CRUISERWEIGHT,
        weightLimit: 375,
        batteryCapacity: 95,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-006-CW',
        model: DroneModel.CRUISERWEIGHT,
        weightLimit: 375,
        batteryCapacity: 60,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-007-HW',
        model: DroneModel.HEAVYWEIGHT,
        weightLimit: 500,
        batteryCapacity: 100,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-008-HW',
        model: DroneModel.HEAVYWEIGHT,
        weightLimit: 500,
        batteryCapacity: 45,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-009-MW',
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: 250,
        batteryCapacity: 30,
        state: DroneState.IDLE
      },
      {
        serialNumber: 'DRN-010-LW',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 125,
        batteryCapacity: 20,
        state: DroneState.IDLE
      }
    ];
    await droneRepo.save(drones);
    console.log('10 drones seeded');
  } else {
    console.log('Drones data already seeded, skipping...');
  }
  const medicationsCount = await medicationRepo.count({ take: 10 });
  if (medicationsCount === 0) { 
    const medications = [
      {
        name: 'Aspirin-500',
        weight: 50,
        code: 'ASP_500',
        image: '/uploads/aspirin.jpg'
      },
      {
        name: 'Paracetamol-1000',
        weight: 75,
        code: 'PARA_1000',
        image: '/uploads/paracetamol.jpg'
      },
      {
        name: 'Ibuprofen-400',
        weight: 60,
        code: 'IBU_400',
        image: '/uploads/ibuprofen.jpg'
      },
      {
        name: 'Amoxicillin-250',
        weight: 100,
        code: 'AMOX_250',
        image: '/uploads/amoxicillin.jpg'
      },
      {
        name: 'Insulin-Pen',
        weight: 150,
        code: 'INS_PEN',
        image: '/uploads/insulin.jpg'
      },
      {
        name: 'Ventolin-Inhaler',
        weight: 80,
        code: 'VENT_INH',
        image: '/uploads/ventolin.jpg'
      },
      {
        name: 'Vitamin-D3',
        weight: 40,
        code: 'VIT_D3',
        image: '/uploads/vitamin-d.jpg'
      },
      {
        name: 'Metformin-500',
        weight: 90,
        code: 'MET_500',
        image: '/uploads/metformin.jpg'
      },
      {
        name: 'Omeprazole-20',
        weight: 45,
        code: 'OMEP_20',
        image: '/uploads/omeprazole.jpg'
      },
      {
        name: 'Lisinopril-10',
        weight: 55,
        code: 'LIS_10',
        image: '/uploads/lisinopril.jpg'
      }
    ];
    await medicationRepo.save(medications);
    console.log('10 medications seeded');
  } else {
    console.log('Medications data already seeded, skipping...');
  }

}