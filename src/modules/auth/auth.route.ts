// ! src/modules/auth/auth.route.ts

import { Router } from "express";
import { API_PREFIX } from "../../common";
import { authController } from "./auth.controller";

const authRouter: Router = Router();

const base = `${API_PREFIX}/auth`;

authRouter.post(
    `${base}/register`,
    authController.retisgerUser.bind(authController)
);


export default authRouter;