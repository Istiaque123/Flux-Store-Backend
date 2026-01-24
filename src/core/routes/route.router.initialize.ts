// ! src/core/routes/route.router.initialize.ts

import type { Application, Router } from "express";
import { getAuthMiddleWare, getAuthorizationMiddleware } from "../app";
import { UserRoles } from "../../common";

export function createRouterManager(app: Application): {
    regesterProtectedRouters: (path: string, router: Router, role: UserRoles) => void;
    regesterPublicRoutes: (path: string, router: Router) => void;
    applyRoutes: () => void;
} {
  const publicRoutes: any[] = [];
  const protectedRoutes: any[] = [];

  function regesterPublicRoutes(path: string, router: Router): void {
    publicRoutes.push({
      path,
      router,
    });
  }

  function regesterProtectedRouters(
    path: string,
    router: Router,
    role: UserRoles
  ): void {
    protectedRoutes.push({
      path,
      router,
      role,
    });
  }

  function applyRoutes(): void {
    publicRoutes.forEach((route): void => {
      app.use(route.path, route.router);
    });

    protectedRoutes.forEach((route): void => {
      app.use(
        route.path,
        getAuthMiddleWare,
        getAuthorizationMiddleware(route.role),
        route.router, );
    });
  }

  return {
    regesterProtectedRouters,
    regesterPublicRoutes,
    applyRoutes,
  };
}
