// ! src/modules/auth/dto/req_dtos/register.dto.ts

export interface RegisterDto {
  email: string;
  password: string;
  confirm_password: string;
}
