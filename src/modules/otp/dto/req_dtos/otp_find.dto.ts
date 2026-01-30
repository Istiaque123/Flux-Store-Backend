// ! src/modules/otp/dto/req_dtos/otp_find.dto.ts


export interface OtpFindDto{
    otp_code: string,
    email?: string,
    phone?: string
}