// ! src/middlewares/error.middleware.ts

import type { Request, Response, NextFunction } from "express";

import { ApiError, logger } from "../utils";
import { HTTP_STATUS } from "../common";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  logger.error(
    `[ERROR] ${req.method} ${req.originalUrl}\n${err.message}\n${err.stack}`
  );

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      data: null,
      success: false,
      message: err.message,
      status: err.statusCode,
    });
  }
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    data: null,
    success: false,
    message: "Internal Server Error",
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  });
};
