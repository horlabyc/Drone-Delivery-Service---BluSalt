import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DroneService } from "../services/drone-service";
import catchAsync from '../utils/catch-async';
import sendResponse from '../utils/send-response';

export class DroneController {
  private droneService = new DroneService();
  
  registerDrone = catchAsync(async (req: Request, res: Response) => {
    const response = await this.droneService.registerDrone(req.body);
    if (!response.success) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {}, response.error || 'Drone could not be registered', '01');
    }
    return sendResponse(res, httpStatus.OK, { drone: response.data }, 'Drone registered successfully');
  })
}