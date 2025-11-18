import { Router } from 'express'
import { DroneController } from '../controllers/drone-controller';
import validate from '../middleware/validate.middleware';
import { getAllDrones, getAvailableDrones, getDroneMedications, loadDrone, registerDrone } from '../middleware';

const router = Router();
const droneController = new DroneController();

// Drone routes
router.post('/drones', validate(registerDrone), droneController.registerDrone);
router.post('/drones/load', validate(loadDrone), droneController.loadDrone);
router.get('/drones', validate(getAllDrones), droneController.getAllDrones);
router.get('/drones/available', validate(getAvailableDrones), droneController.getAvailableDrones);
router.get('/drones/:droneId/medications', validate(getDroneMedications), droneController.getLoadedMedications);

export default router;