// ! src/modules/auth/auth.route.ts

import { Router } from "express";
import { API_PREFIX, UserRoles } from "../../common";
import { authController } from "./auth.controller";
import { getAuthorizationMiddleware } from "../../core/app";


const authPublicRouter: Router = Router();
const authPrivateRouter: Router = Router();

const base = `${API_PREFIX}/auth`;

// !-------------------------------------------------
// ! Public routes
authPublicRouter.post(
    `${base}/register`,
    authController.registerUser.bind(authController)
);

authPublicRouter.post(
    `${base}/login`,
    authController.loginUser.bind(authController),
);

authPublicRouter.post(
    `${base}/forger-password`,
    authController.forgerPassword.bind(authController),
);



// !-------------------------------------------------
// ! Private routes
authPrivateRouter.post(
    `${base}/update-password`,
    getAuthorizationMiddleware(UserRoles.user),
    authController.updatePassword.bind(authController)
);



export default {
    authPublicRouter: authPublicRouter,
    authPrivateRouter: authPrivateRouter
};