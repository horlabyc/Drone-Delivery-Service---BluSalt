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
    const filter = pick(req.query, ['state', 'model', 'dateFrom', 'dateTo']);
    const options: IOptions = pick(req.query, ['sortBy', 'pageSize', 'page']);
    const response = await this.droneService.getAllDrones(options, filter);
    return sendResponse(res, httpStatus.OK, response, 'All drones', '00');
  })

  getAvailableDrones = catchAsync(async (req: Request, res: Response) => {
    const options: IOptions = pick(req.query, ['sortBy', 'pageSize', 'page']);
    const drones = await this.droneService.getAvailableDrones(options);
    return sendResponse(res, httpStatus.OK, drones, 'All available drones', '00');
  })

  getLoadedMedications = catchAsync(async (req: Request, res: Response) => {
    const response = await this.droneService.getLoadedMedications(req.params.droneId);
    if (!response.success) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {}, response.error || 'Drone medications could not be fetched', '01');
    }
    return sendResponse(res, httpStatus.OK, { drone: response.data }, 'All drone medications', '00');
  })

  getDroneBattery = catchAsync(async (req: Request, res: Response) => {
    const response = await this.droneService.getDroneBatteryLevel(req.params.droneId);
    if (!response.success) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {}, response.error || 'Drone battery level could not be fetched', '01');
    }
    return sendResponse(res, httpStatus.OK, { batteryLevel: response.data }, 'Drone battery level', '00');
  })
}