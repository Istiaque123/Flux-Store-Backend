// ! src/modules/auth/dto/login.res.dto.ts



export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  timestamp: Date;
}