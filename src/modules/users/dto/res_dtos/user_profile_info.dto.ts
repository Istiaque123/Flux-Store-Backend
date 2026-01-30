// ! src/modules/users/dto/res_dtos/user_profile_info.dto.ts


export interface UserProfileInfoDto{
    id:string;
    user_id: string;
    name: string;
    address?: string | null;
    email: string;
    phone?: string| null;

}