import { Response } from 'express';

interface ResponsePayload {
  data: Record<string, any>;
  message: string;
  responseCode?: string | undefined;
}
const sendResponse = (
  res: Response,
  httpStatus: number,
  responseBody: any,
  message: string,
  responseCode?: string
) => {
  const payload: ResponsePayload = {
    data: responseBody,
    message,
    responseCode,
  };
  if (!responseCode) {
    delete payload.responseCode;
  }
  return res.status(httpStatus).send({ ...payload });
};

export default sendResponse;