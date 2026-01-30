// ! src/core/routes/route.router.register.ts
import type { createRouterManager } from "./route.router.initialize";
import authRouter from "../../modules/auth/auth.route";
import otpRoute from "../../modules/otp/otp.route";
import userProfileRouter from "../../modules/users/user.route";



export function registerAllRoutes(routerManager: ReturnType<typeof createRouterManager>) {
  // !Public routes 
  // !Public routes 
  routerManager.regesterPublicRoutes('', authRouter.authPublicRouter);
  routerManager.regesterPublicRoutes('', otpRoute.otpPublicRouter);

  // ! Protected routes 
  // ! Protected routes 
  routerManager.regesterProtectedRouters('', authRouter.authPrivateRouter);
  routerManager.regesterProtectedRouters('', otpRoute.otpPrivateRouter);
  routerManager.regesterProtectedRouters('', userProfileRouter);

  return routerManager;
}