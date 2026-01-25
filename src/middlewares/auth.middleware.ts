// ! src/middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { HTTP_STATUS } from "../common";
import { logger } from "../utils";


export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | undefined => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Access denied. No token provided.",
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  try {
    const decode: string | jwt.JwtPayload = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    if (!decode) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    

    req.user = decode as any;
    next();

  } catch (e: any) {

    let message = 'Invalid token';
    let status = HTTP_STATUS.UNAUTHORIZED;

    if (e.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (e.name === 'JsonWebTokenError') {
      message = 'Invalid token signature';
    }

    logger.warn(`JWT verification failed: ${e.message} - ${req.ip}`);

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: message,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
  }
};
