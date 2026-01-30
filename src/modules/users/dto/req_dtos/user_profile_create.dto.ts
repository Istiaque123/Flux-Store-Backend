// ! src/modules/users/dto/req_dtos/user_profile_create.dto.ts

export interface UserProfileCreateDto {
  user_id: string;
  email: string;
  phone: string;
  name: string;
  address: string;
}
