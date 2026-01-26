// ! src/core/routes/route.router.initialize.ts

import type { Application, Router } from "express";
import { getAuthMiddleWare, getAuthorizationMiddleware } from "../app";
import type { UserRoles } from "../../common";


export function createRouterManager(app: Application): {
  regesterProtectedRouters: (path: string, router: Router, role?: UserRoles) => void;
  regesterPublicRoutes: (path: string, router: Router) => void;
  applyRoutes: () => void;
} {
  const publicRoutes: { path: string; router: Router }[] = [];
  const protectedRoutes: { path: string; router: Router; role?: UserRoles | undefined }[] = [];

  function regesterPublicRoutes(path: string, router: Router): void {
    publicRoutes.push({ path, router });
  }

  function regesterProtectedRouters(
    path: string,
    router: Router,
    role?: UserRoles   // ← now optional
  ): void {
    protectedRoutes.push({ path, router, role });
  }

  function applyRoutes(): void {
    publicRoutes.forEach((route: {
      path: string;
      router: Router;
    }): void => {
      app.use(route.path, route.router);
    });

    protectedRoutes.forEach((route: {
      path: string;
      router: Router;
      role?: UserRoles | undefined;
    }): void => {
      const middlewares: any[] = [getAuthMiddleWare()]; // ! always apply token check

      // ! Only add role middleware if role is provided
      if (route.role !== undefined) {
        middlewares.push(getAuthorizationMiddleware(route.role));
      }

      middlewares.push(route.router);

      app.use(route.path, ...middlewares);
    });
  }

  return {
    regesterProtectedRouters,
    regesterPublicRoutes,
    applyRoutes,
  };
}