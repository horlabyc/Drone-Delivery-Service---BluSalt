import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DroneService } from "../services/drone-service";
import catchAsync from '../utils/catch-async';
import sendResponse from '../utils/send-response';
import pick from '../utils/pick';
import { IOptions } from '../types';
import { MedicationService } from '../services/medication-service';

export class MedicationsController {
  private medicationService = new MedicationService();

  getAllMedications = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['searchTerm', 'dateFrom', 'dateTo']);
    const options: IOptions = pick(req.query, ['sortBy', 'pageSize', 'page']);
    const response = await this.medicationService.getAllMedications(options, filter);
    return sendResponse(res, httpStatus.OK, response, 'All medications', '00');
  })

  registerMedication = catchAsync(async (req: Request, res: Response) => {
    const response = await this.medicationService.registerMedication(req.body);
    if (!response.success) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {}, response.error || 'Medication could not be registered', '01');
    }
    return sendResponse(res, httpStatus.OK, { medication: response.data }, 'Medication registered successfully', '00');
  })
}