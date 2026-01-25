// ! src/modules/auth/dto/register.res.dto.ts

export interface RegisterResposeDto{
    user_id:string;
    email: string;
    role:string;
    created_at: Date;
}