import Joi from "joi";
import { DroneModel, DroneState } from "../types";

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

export const loadDrone = {
  body: Joi.object().keys({
    droneId: Joi.string().uuid().required(),
    medicationIds: Joi.array().items(Joi.string()).required()
  })
};

export const getAllDrones = {
  query: Joi.object().keys({
    page: Joi.string(),
    pageSize: Joi.string(),
    sortBy: Joi.string().valid('desc', 'asc', 'createdAt'),
    dateFrom: Joi.date(),
    dateTo: Joi.date(),
    state: Joi.string().valid(DroneState.DELIVERED, DroneState.DELIVERING, DroneState.IDLE, DroneState.LOADED, DroneState.LOADING, DroneState.RETURNING),
    model: Joi.string().valid(DroneModel.CRUISERWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGHTWEIGHT, DroneModel.MIDDLEWEIGHT),
  })
};

export const getAvailableDrones = {
  query: Joi.object().keys({
    page: Joi.string(),
    pageSize: Joi.string(),
    sortBy: Joi.string().valid('desc', 'asc', 'createdAt'),
    dateFrom: Joi.date(),
    dateTo: Joi.date(),
    model: Joi.string().valid(DroneModel.CRUISERWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGHTWEIGHT, DroneModel.MIDDLEWEIGHT),
  })
};

export const validateDroneIdParam = {
  param: Joi.object().keys({
    droneId: Joi.string().uuid().required(),
  }),
};