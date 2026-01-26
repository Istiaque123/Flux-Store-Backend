// ! src/core/routes/route.router.register.ts

import authRouter from "../../modules/auth/auth.route";
import type { createRouterManager } from "./route.router.initialize";


export function registerAllRoutes(routerManager: ReturnType<typeof createRouterManager>) {
  // !Public routes 
  // !Public routes 
  routerManager.regesterPublicRoutes('', authRouter.authPublicRouter);

  // ! Protected routes 
  // ! Protected routes 
  routerManager.regesterProtectedRouters('', authRouter.authPrivateRouter);

  return routerManager;
}