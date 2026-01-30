// ! src/modules/otp/otp.query.ts

import { randomInt } from "crypto";
import { OTP_TABLES } from "./models/otp_models.name";
import { DBQuery } from "../../config";
import type { OtpCreateDto, OtpFindDto, OtpRow } from "./dto";

export class OtpQuery {
  private otpTable: string = OTP_TABLES.otp;

  // ? Helper Function to create otp
  private generateOTP(): string {
    const timePart: number = Date.now() % 1000; // adds time variance
    const randomPart: number = randomInt(100000, 999999);
    return ((randomPart + timePart) % 1_000_000).toString().padStart(6, "0");
  }

  // ! create and store OTP for email or phone
  async createOtp(data: OtpCreateDto): Promise<OtpRow | null> {
    const otpCode: string = this.generateOTP();
    const expaireAt = new Date(
      Date.now() + 10 * 60 * 1000 // ! 10 minutes
    );

    // console.log(data);
    

    return DBQuery.insert<OtpRow>(this.otpTable, {
      email: data.email,
      phone: data.phone,
      otp_code: otpCode,
      expires_at: expaireAt,
      is_used: false,
    });
  }

  // ! Find valid (unused + not expired) OTP
  async findValidOtp(
    data: OtpFindDto
  ): Promise<OtpRow | null> {
    const condition: any = {
      otp_code: data.otp_code,
      is_used: false,
      is_delete: false,
    };

    if (data.email) {
      condition.email = data.email;
    }
    if (data.phone) {
      condition.phone = data.phone;
    }

    return DBQuery.findOne<OtpRow>(
      this.otpTable,
      ["id", "email", "phone", "otp_code", "expires_at", "is_used"],
      condition
    );
  }

  // ! Mark OTP as used
  async markOtpUsed(otpId: string): Promise<boolean> {
    const [updated] = await DBQuery.update<OtpRow>(
      this.otpTable,
      {
        is_used: true,
        used_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: otpId,
      }
    );

    return !!updated;
  }
}

export const otpQuery: OtpQuery = new OtpQuery();
