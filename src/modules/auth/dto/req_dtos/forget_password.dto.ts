
// ! src/modules/auth/dto/req_dtos/forget_password.dto.ts


export interface ForgetPasswordDto {
    email: string;
    otp: string;
    new_password: string;
    confirm_password: string;
}