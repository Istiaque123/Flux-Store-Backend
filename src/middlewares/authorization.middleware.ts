// src/middlewares/authorization.middleware.ts

import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, UserRoles } from "../common";
import { logger } from "../utils";

export class AuthorizationMiddleware {
  // Single role
  static authorizationMiddleware = (requiredRole: UserRoles) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {   // ← Promise<void>
      const userRole = req.user?.role;

      if (!userRole) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Not authenticated",
          status: HTTP_STATUS.UNAUTHORIZED,
        });
        return;   // early return, no next()
      }

      if (userRole !== requiredRole) {
        logger.warn(
          `Permission denied - required: ${requiredRole}, user: ${userRole}, path: ${req.path}`
        );

        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: `Access denied. Required role: ${requiredRole}`,
          status: HTTP_STATUS.FORBIDDEN,
        });
        return;
      }

      logger.info(`Permission granted - role: ${userRole}, path: ${req.path}`);
      next();
    };
  };

  // Multiple roles
  static requireAnyRole = (...allowedRoles: UserRoles[]) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {   // ← Promise<void>
      const userRole = req.user?.role;

      if (!userRole) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Not authenticated",
          status: HTTP_STATUS.UNAUTHORIZED,
        });
        return;
      }

      if (!allowedRoles.includes(userRole)) {
        logger.warn(
          `Permission denied - allowed: ${allowedRoles.join(', ')}, user: ${userRole}, path: ${req.path}`
        );

        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: `Access denied. Allowed roles: ${allowedRoles.join(', ')}`,
          status: HTTP_STATUS.FORBIDDEN,
        });
        return;
      }

      logger.info(`Permission granted - role: ${userRole}, path: ${req.path}`);
      next();
    };
  };

  static mockAuthorizationMiddleware = (role: UserRoles) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      logger.info(`[MOCK] Authorization granted for role: ${role}`);
      next();
    };
  };
}