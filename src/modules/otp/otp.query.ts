// ! src/modules/otp/otp.query.ts

import { randomInt } from "crypto";
import { OTP_TABLES } from "./models/otp_models.name";
import { DBQuery } from "../../config";
import type { OtpRow } from "./dto";
import bcrypt from 'bcrypt';


export class OtpQuery {
    private otpTable: string = OTP_TABLES.otp;

    // ? Helper Function to create otp
    private generateOTP(): string {
        const timePart: number = Date.now() % 1000; // adds time variance
        const randomPart: number = randomInt(100000, 999999);
        return ((randomPart + timePart) % 1_000_000).toString().padStart(6, '0');
    }



    // ! create and store OTP for email or phone
    async createOtp(
        email?: string,
        phone?: string,
    ): Promise<OtpRow | null> {
        const otpCode: string = this.generateOTP();
        const expaireAt = new Date(
            Date.now() + 10 * 60 * 1000 // ! 10 minutes
        );


        return DBQuery.insert<OtpRow>(
            this.otpTable, {
            email,
            phone,
            otp_code: otpCode,
            expires_at: expaireAt,
            is_used: false,
        }
        );
    }

    // ! Find valid (unused + not expired) OTP
    async findValidOtp(
        otpCode: string,
        email?: string,
        phone?: string,
    ): Promise<OtpRow | null> {
        const condition: any = {
            otp_code: otpCode,
            is_used: false,
            is_delete: false
        };

        if (email) {
            condition.email = email;
        }
        if (phone) {
            condition.phone = phone;
        }

        return DBQuery.findOne<OtpRow>(
            this.otpTable,
            [
                'id',
                'email',
                'phone',
                'otp_code',
                'expires_as',
                'is_used',
            ],
            condition,
        );
    }


    // ! Mark OTP as used
    async markOtpUsed(otpId: string): Promise<boolean> {
        const [updated] = await DBQuery.update<OtpRow>(
            this.otpTable,{
                is_used: true,
                used_at: new Date(),
                updated_at: new Date(),
            },{
                id: otpId,
            }
        );

        return !!updated;
    }

}

export const otpQuery: OtpQuery = new OtpQuery();