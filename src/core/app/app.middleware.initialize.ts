// ! src/core/app/app.middleware.initialize.ts

import express, { type Application } from "express";
import { authMiddleware, AuthorizationMiddleware, responseMiddleware } from "../../middlewares";
import { UserRoles } from "../../common";
import { logger } from "../../utils";



export const initMiddlewares = (app: Application): void => {
  app.use(express.json());
};

export function applyCoreMiddleWare(app: Application): Application {
    app.use(responseMiddleware);
    return app;
}

// ! Single role - returns the middleware function
export function getAuthorizationMiddleware(
  role: UserRoles
): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> {
  logger.info(`Working on single-role authorization: ${role}`);
  return AuthorizationMiddleware.authorizationMiddleware(role);
}

// Multiple roles - returns the middleware function
export function getMultiAuthorizationMiddleware(
  ...roles: UserRoles[]
): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> {
  logger.info(`Working on multi-role authorization: ${roles.join(', ')}`);
  return AuthorizationMiddleware.requireAnyRole(...roles);
}

export function getAuthMiddleWare(): any{
    return authMiddleware;
}
