import Joi from "joi";
import { DroneModel } from "../types";

export const registerDrone = {
  body: Joi.object().keys({
    batteryCapacity: Joi.number().min(0).max(100).required(),
    serialNumber: Joi.string().max(100).required(),
    model: Joi.string()
      .valid(DroneModel.CRUISERWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGHTWEIGHT, DroneModel.MIDDLEWEIGHT)
      .required(),
    weightLimit: Joi.number().max(500).min(1).required()
  })
};