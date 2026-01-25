// ! src/modules/auth/dto/update_password.dto.ts
export interface UpdatePasswordDto {

    user_id: string;
    old_password: string;
    new_password: string;
    

}