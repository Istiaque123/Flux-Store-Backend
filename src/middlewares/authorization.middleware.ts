// ! src/middlewares/authorization.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, UserRoles } from "../common";
import { logger } from "../utils";

export class AuthorizationMiddleware {
  static authorizationMiddleware = (role: UserRoles) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response<any, Record<string, any>> | undefined> => {
      const userRole: UserRoles | undefined = req.user?.role;

      if (userRole != role) {
        logger.warn(
          `Permission denied ${{ accessRole: role, userRole: userRole }}`
        );

        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          data: null,
          success: false,
          message: "Unauthorized access attempt",
          status: HTTP_STATUS.UNAUTHORIZED,
        });
      }

      logger.info(
        `Permission granted ${{ accessRole: role, userRole: userRole }}`
      );

      next();
    };
  };

  static mockAuthorizationMiddleware = (role: UserRoles) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      logger.info(
        `Mock Authorization Permission granted ${{ accessRole: role }}`
      );

      next();
    };
  };
}
