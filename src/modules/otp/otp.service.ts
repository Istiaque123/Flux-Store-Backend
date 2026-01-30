import { HTTP_STATUS } from "../../common";
import { ApiError, logger } from "../../utils";
import type { OtpRow, OtpSendResponse } from "./dto";
import { OtpQuery, otpQuery } from "./otp.query";


// ! src/modules/otp/otp.service.ts

export class OtpService {
  private otpQuery: OtpQuery = otpQuery;

  // * Send otp by emial
  async sendOtpByEmail(email: string): Promise<OtpSendResponse> {
    // ? create otp
    const otpResult: OtpRow | null = await this.otpQuery.createOtp(
      {email: email, }
    );

    if (!otpResult) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to generate OTP"
      );
    }

    try{

        // ! add email service



    
        return {
            email: email,
            otp_code: otpResult.otp_code,
            is_used: otpResult.is_used,
            expires_at: otpResult.expires_at,
            
        };
    }catch(err: any){
        logger.error(`Failed to send OTP to email: ${email}\n${err.message}\n${err}`);
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, `Failed to send OTP on this email: ${email}`);
    }

  }
  // * Send otp by phone
  async sendOtpByPhone(phone: string): Promise<OtpSendResponse> {
    // ? create otp
    const otpResult: OtpRow | null = await this.otpQuery.createOtp({phone: phone});

    if (!otpResult) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to generate OTP"
      );
    }

    try{

        // ! add phone service



    
        return {
            phone: phone,
            otp_code: otpResult.otp_code,
            is_used: otpResult.is_used,
            expires_at: otpResult.expires_at,
            
        };
    }catch(err: any){
        logger.error(`Failed to send OTP on this phone : ${phone} \n${err.message}\n${err}`);
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, `Failed to send OTP on this email: ${phone}`);
    }

  }




}


export const otpService: OtpService = new OtpService();