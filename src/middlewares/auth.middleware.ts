// src/middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { HTTP_STATUS, UserRoles } from "../common";
import { logger } from "../utils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {

  // logger.info("inside auth middleware");

  
  const authHeader: string | undefined = req.headers.authorization;

  // ! More precise header check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Access denied. No token provided.",
      status: HTTP_STATUS.UNAUTHORIZED,   // ← corrected (was BAD_REQUEST before)
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Access denied. Malformed token.",
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

    // ? Optional: extra safety check (rarely needed)
    if (!decoded || !decoded.id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token payload",
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    // ! Attach to req.user with proper type
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role ,
      // add iat, exp if needed
    } as any;

    next();
  } catch (err: any) {
    let message = "Invalid token";
    let status = HTTP_STATUS.UNAUTHORIZED;

    switch (err.name) {
      case "TokenExpiredError":
        message = "Token has expired";
        break;
      case "JsonWebTokenError":
        message = "Invalid token signature";
        break;
      case "NotBeforeError":
        message = "Token not yet valid";
        break;
      default:
        message = "Authentication failed";
    }

    logger.warn(`JWT verification failed: ${err.name} - ${err.message} - IP: ${req.ip}`);

    return res.status(status).json({
      success: false,
      message,
      status,
    });
  }
};