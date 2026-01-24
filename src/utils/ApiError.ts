// ! src/utils/ApiError.ts



export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, messages: string) {
    super(messages);

    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
