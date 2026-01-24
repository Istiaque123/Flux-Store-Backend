// ! src/core/routes/route.router.register.ts

import authRouter from "../../modules/auth/auth.route";
import type { createRouterManager } from "./route.router.initialize";


export function registerAllRoutes(routerManager: ReturnType<typeof createRouterManager>){

    // ! public routes
    // ! public routes
    routerManager.regesterPublicRoutes('', authRouter);





    // ! ---------------------------------------------------------------------------------


    // ! protected routes
    // ! protected routes





    return routerManager;
}