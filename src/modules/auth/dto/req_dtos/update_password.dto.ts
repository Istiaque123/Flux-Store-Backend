// ! src/modules/auth/dto/req_dtos/update_password.dto.ts
export interface UpdatePasswordDto {

    user_id: string;
    old_password: string;
    new_password: string;
    

}