class ApiError extends Error {
  statusCode: number;

  isOperational: boolean;

  override stack?: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
