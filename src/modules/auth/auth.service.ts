import { AuthQuery, authQuery } from "./auth.query";

import type {
  FullUserRaw,
  LoginDto,
  RegisterDto,
  SafeUserRaw,
  RegisterResposeDto,
  LoginResponseDto,
  UpdatePasswordDto,
  UpdatePasswordResponseDto,
  ForgetPasswordDto,
} from "./dto";
import { ApiError, logger } from "../../utils";
import { HTTP_STATUS } from "../../common";
import { compairePassword, hashPassword } from "../../utils/password.util";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { OtpQuery, otpQuery } from "../otp/otp.query";
import type { OtpRow } from "../otp";

// ! src/modules/auth/auth.service.ts

export class AuthService {
  private query: AuthQuery = authQuery;
  private otpQuery: OtpQuery = otpQuery;

  // * Register a valid user
  async registerUser(data: RegisterDto): Promise<RegisterResposeDto> {
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
      logger.error(`Registration failed for ${data.email}: ${error.message}`);

      // Throw safe error to client
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to create user. Please try again later."
      );
    }
  }

  // * login user
  async loginUser(data: LoginDto): Promise<LoginResponseDto> {
    // ! check for existing user
    const existingUser: FullUserRaw | null = await this.query.findByEmail(
      data.email
    );

    // console.log(existingUser);

    if (!existingUser) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "user not found or already delete"
      );
    }

    // ? verify password

    const passwordMatch: boolean = await compairePassword(
      data.password,
      existingUser.password
    );

    if (!passwordMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "wrong password");
    }

    try {
      // ! generate token
      const payload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };

      // ! expaire time
      const timestamp: Date = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const accessToken: string = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2d",
      });

      const refreshToken: string = jwt.sign(
        {
          id: existingUser.id,
        },
        env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "4d",
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
        accessToken: accessToken,
        refreshToken: refreshToken,
        timestamp: timestamp,
      };
    } catch (error: any) {
      logger.error(
        `login failed for ${data.email}: ${error.message}\n${error}`
      );
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Login failed. Please try again later."
      );
    }
  }

  // * upadate password
  async updatePassword(
    data: UpdatePasswordDto
  ): Promise<UpdatePasswordResponseDto> {
    const existingUser: FullUserRaw | null = await this.query.findById(
      data.user_id
    );

    if (!existingUser) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "user not found or already delete"
      );
    }

    // ! check old password
    const decodePassword: boolean = await compairePassword(
      data.old_password,
      existingUser.password
    );

    if (!decodePassword) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Old password does not match"
      );
    }

    try {
      // ! generate new password
      const hashed: string = await hashPassword(data.new_password);

      // ! update existing password
      const result: boolean = await this.query.updatePassword(
        existingUser.id,
        hashed
      );

      if (result) {
        return {
          user_id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          is_password_change: true,
        };
      } else {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "failed to update password."
        );
      }
    } catch (error: any) {
      logger.error(
        `failed to update password for ${data.user_id}: ${error.message}`
      );
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to create user. Please try again later."
      );
    }
  }

  // * forget password
  async forgetPassword(data: ForgetPasswordDto): Promise<UpdatePasswordResponseDto> {

    // ! check users
    const checkUserExist: FullUserRaw | null = await this.query.findByEmail(data.email);
    if (!checkUserExist) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "there is no user exist for this email");
    }



    // ! check password

    if (data.new_password !== data.confirm_password) {
      throw new ApiError(HTTP_STATUS.NOT_ACCEPTABLE, "password did not mathch");
    }

    // ! check otp
    const otpResult: OtpRow | null = await this.otpQuery.findValidOtp({
      otp_code: data.otp,
      email: data.email,
    });

    if (!otpResult) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired OTP')
    }
    try {
      // ! validate otp
      if (new Date > otpResult.expires_at) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "OTP has expired");
      }


      const hased: string = await hashPassword(data.confirm_password);
      const result: FullUserRaw | null = await this.query.restorePassword(data.email, hased);

      if (!result) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'failed to reset passwor')
      }

      // ! update password

      await this.otpQuery.markOtpUsed(otpResult.id);

      return  {
          user_id: result.id,
          email: result.email,
          role: result.role,
          is_password_change: true,
        } ;
    }  catch (error: any) {
      logger.error(
        `failed to reset password for ${data.email}: ${error.message}\n${error}`
      );

      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to restore password. Please try again later."
      );
    }
  }
}

export const authService = new AuthService();
