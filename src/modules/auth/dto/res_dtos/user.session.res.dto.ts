// ! src/modules/auth/dto/res_dtos/session.res.dto.ts

export interface UserSessionResDto {
  user_id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  address?: string;

  user_created_at: Date;
  profile_created_at?: Date;
  profile_updated_at?: Date;

}
