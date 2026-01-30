// ! src/modules/otp/otp.route.ts


import {Router} from 'express';
import { API_PREFIX } from '../../common';
import { otpController } from './otp.controller';





const otpPublicRouter: Router = Router();
const otpPrivateRouter: Router = Router();


const base = `${API_PREFIX}/otp`;


// !-------------------------------------------------
// ! Public routes
otpPublicRouter.post(
    `${base}/public/send-email`,
    otpController.sendOtpByEmail.bind(otpController),
);
otpPublicRouter.post(
    `${base}/public/send-phone`,
    otpController.sendOtpByPhone.bind(otpController),
);





// !-------------------------------------------------
// ! Private routes

otpPrivateRouter.post(
    `${base}/private/send-email`,
    otpController.sendOtpByEmail.bind(otpController),
);
otpPrivateRouter.post(
    `${base}/private/send-phone`,
    otpController.sendOtpByPhone.bind(otpController),
);



export default {
    otpPublicRouter: otpPublicRouter,
    otpPrivateRouter: otpPrivateRouter,
}