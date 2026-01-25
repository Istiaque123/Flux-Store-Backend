import { AuthQuery, authQuery } from "./auth.query";

import type { 
  FullUserRaw,
   LoginDto,
   RegisterDto,
   SafeUserRaw,
   RegisterResposeDto, 
   LoginResponseDto , 
   UpdatePasswordDto
  } from "./dto";
import { ApiError, logger } from "../../utils";
import { HTTP_STATUS } from "../../common";
import { compairePassword, hashPassword } from "../../utils/password.util";
import jwt from 'jsonwebtoken';
import { env } from "../../config";




// ! src/modules/auth/auth.service.ts

export class AuthService {
  private query: AuthQuery = authQuery;

  // * Register a valid user
  async registerUser(data: RegisterDto): Promise<RegisterResposeDto>  {
    // Domain checks — throw ApiError directly (no catch needed)
    const existingUser: FullUserRaw | null = await this.query.findByEmail(
      data.email
    );

    if (existingUser) {
      logger.warn(`Duplicate registration attempt: ${data.email}`);
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already registered");
    }

    if (data.password !== data.confirm_password) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Passwords do not match");
    }

    // Critical operations — wrap in try/catch for logging
    try {
      const hashed: string = await hashPassword(data.password);

      const user: SafeUserRaw | null = await this.query.registerUser({
        email: data.email,
        password: hashed,
      });

      if (!user) {
        throw new Error("Failed to register user"); 
      }

      return {
        user_id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      };
    } catch (error: any) {
      // Log the REAL error (DB connection, table missing, etc.)
      logger.error(
        `Registration failed for ${data.email}: ${error.message}`,
      );

      // Throw safe error to client
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to create user. Please try again later."
      );
    }
  }

  // * login user
  async loginUser(data: LoginDto): Promise<LoginResponseDto>{

    // ! check for existing user
    const existingUser: FullUserRaw | null = await this.query.findByEmail(data.email);

    // console.log(existingUser);
    

    if (!existingUser) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'user not found or already delete');
    }

    try {
      // ? verify password

      const passwordMatch: boolean = await compairePassword(data.password, existingUser.password );
      if (!passwordMatch) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
      }

      // ! generate token
      const payload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };

      const timestamp: Date = new Date();
      const accessToken: string = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
      });



      const refreshToken: string = jwt.sign({
        id: existingUser.id
      }, env.REFRESH_TOKEN_SECRET,{
        expiresIn: '4d'
      }
    );

    // ! store refresh token
    await authQuery.storeRefreshToken({
      user_id: existingUser.id,
      auth_token: refreshToken,
      timestamp: timestamp,
    });

    // ! now return 
    return {
      accessToken:accessToken,
      refreshToken:refreshToken,
      timestamp: timestamp
    }
    } catch (error: any) {
     logger.error(`login failed for ${data.email}: ${error.message}\n${error}`);
     throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Login failed. Please try again later.');
    }

  }

  // * upadate password
  async updatePassword(data: UpdatePasswordDto):Promise<{
    user_id: string;
    email: string;
    role: string;
} | undefined>{

    const existingUser: FullUserRaw | null = await this.query.findById(data.user_id);

    if (!existingUser) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'user not found or already delete');
    }

    try {
      // ! check old password
      const decodePassword: boolean = await compairePassword(data.new_password,
        existingUser.password
      );

      if (!decodePassword) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Old password does not match");
      }

      // ! generate new password
      const hashed: string = await hashPassword(data.new_password);

      // ! update existing password
      const result: boolean = await this.query.updatePassword(existingUser.id, hashed);

      if (result) {
        return {
        user_id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        };
      }
      else{
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "failed to update password.");
      }

    } catch (error: any) {
      logger.error(
        `failed to update password for ${data.user_id}: ${error.message}`,
      );
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to create user. Please try again later."
      );

    }
  }
}

export const authService = new AuthService();
