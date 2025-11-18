import { Router } from 'express'
import { DroneController } from '../controllers/drone-controller';
import validate from '../middleware/validate.middleware';
import { loadDrone, registerDrone } from '../middleware';

const router = Router();
const droneController = new DroneController();

// Drone routes
router.post('/drones', validate(registerDrone), droneController.registerDrone);
router.post('/drones/load', validate(loadDrone), droneController.loadDrone);

export default router;