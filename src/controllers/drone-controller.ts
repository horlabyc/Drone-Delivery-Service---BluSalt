import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DroneService } from "../services/drone-service";
import catchAsync from '../utils/catch-async';
import sendResponse from '../utils/send-response';
import pick from '../utils/pick';
import { IOptions } from '../types';

export class DroneController {
  private droneService = new DroneService();
  
  registerDrone = catchAsync(async (req: Request, res: Response) => {
    const response = await this.droneService.registerDrone(req.body);
    if (!response.success) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {}, response.error || 'Drone could not be registered', '01');
    }
    return sendResponse(res, httpStatus.OK, { drone: response.data }, 'Drone registered successfully', '00');
  })

  loadDrone = catchAsync(async (req: Request, res: Response) => {
    const response = await this.droneService.loadDroneWithMedications(req.body);
    if (!response.success) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {}, response.error || 'Drone could not be loaded', '01');
    }
    return sendResponse(res, httpStatus.OK, { drone: response.data }, 'Drone loaded successfully', '00');
  })

  getAllDrones = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['state', 'model', 'searchTerm', 'dateFrom', 'dateTo']);
    const options: IOptions = pick(req.query, ['sortBy', 'pageSize', 'page']);
    const response = await this.droneService.getAllDrones(options, filter);
    return sendResponse(res, httpStatus.OK, response, 'All drones', '00');
  })
}