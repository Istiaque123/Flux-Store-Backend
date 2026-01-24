// ! src/middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { HTTP_STATUS } from "../common";


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

  } catch (e) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token" ,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
  }
};
