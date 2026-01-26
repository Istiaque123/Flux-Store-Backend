// ! src/modules/auth/res_dtos/dto/login.res.dto.ts



export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  timestamp: Date;
}