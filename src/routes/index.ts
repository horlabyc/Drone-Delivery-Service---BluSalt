import { Router } from 'express'
import { DroneController } from '../controllers/drone-controller';
import validate from '../middleware/validate.middleware';
import { getAllDrones, getAvailableDrones, validateDroneIdParam, loadDrone, registerDrone } from '../middleware';
import { MedicationsController } from '../controllers/medications-controller';
import { getAllMedications } from '../middleware/medications';

const router = Router();
const droneController = new DroneController();
const medicationController = new MedicationsController()

// Drone routes
router.post('/drones', validate(registerDrone), droneController.registerDrone);
router.post('/drones/load', validate(loadDrone), droneController.loadDrone);
router.get('/drones', validate(getAllDrones), droneController.getAllDrones);
router.get('/drones/available', validate(getAvailableDrones), droneController.getAvailableDrones);
router.get('/drones/:droneId/medications', validate(validateDroneIdParam), droneController.getLoadedMedications);
router.get('/drones/:droneId/battery', validate(validateDroneIdParam), droneController.getDroneBattery);

// Medication routes
router.get('/medications', validate(getAllMedications), medicationController.getAllMedications);

export default router;