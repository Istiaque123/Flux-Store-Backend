// ! src/modules/auth/dto/res_dtos/update_password.res.dto.ts

export interface UpdatePasswordResponseDto {
    user_id: string;
    email: string;
    role: string;
    is_password_change: boolean,
}