// ! src/modules/otp/otp.controller.ts

import type { Request, Response } from "express";
import { otpService } from "./otp.service";
import { logger, validate } from "../../utils";
import { sendOtpEmailSchema, sendOtpPhoneSchema } from "./otp.validation";
import { HTTP_STATUS, REQUEST_SORUCE } from "../../common";
import type { OtpSendResponse } from "./dto";


export class OtpController {

    private otpService = otpService;

    // * send otp by email
    async sendOtpByEmail(req: Request, res: Response): Promise<void>{
        const data: {email: string} = validate(sendOtpEmailSchema, req, [
            REQUEST_SORUCE.body
        ]);

        // logger.info(`email is: ${data.email}`);

        const otp: OtpSendResponse = await this.otpService.sendOtpByEmail(data.email);

        res.success(otp, HTTP_STATUS.OK, "OTP sent by email");
    }

    // * send otp by phone
    async sendOtpByPhone(req: Request, res: Response): Promise<void>{
        const data: {phone: string} = validate(sendOtpPhoneSchema, req, [
            REQUEST_SORUCE.body
        ]);

        const otp: OtpSendResponse = await this.otpService.sendOtpByPhone(data.phone);

        res.success(otp, HTTP_STATUS.OK, "OTP sent by phone");
    }

}

export const otpController : OtpController = new OtpController();