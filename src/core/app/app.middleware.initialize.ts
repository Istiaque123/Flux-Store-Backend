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

export function getAuthorizationMiddleware(role: UserRoles)
: (req: express.Request, res: express.Response, next: express.NextFunction)
 => Promise<express.Response<any, Record<string, any>> 
 | undefined> {
  logger.info("woriking on role base authz");
  return AuthorizationMiddleware.authorizationMiddleware(role);
}

export function getAuthMiddleWare(): any{
    return authMiddleware;
}
