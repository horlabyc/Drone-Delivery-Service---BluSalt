import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/api-error';
import { QueryFailedError } from 'typeorm';

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof QueryFailedError ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new ApiError(statusCode, message);
  }
  next(error);
};

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  res.locals['errorMessage'] = err.message;
  const response = {
    code: statusCode || httpStatus.BAD_REQUEST,
    message,
  };
  res.status(statusCode).send(response);
};