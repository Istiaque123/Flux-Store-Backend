// ! src/modules/auth/dto/res_dtos/register.res.dto.ts

export interface RegisterResposeDto{
    user_id:string;
    email: string;
    role:string;
    created_at: Date;
}