import { AuthQuery, authQuery } from "./auth.query";

import type { FullUserRaw, RegisterDto, SafeUserRaw } from "./dto";
import { ApiError, logger } from "../../utils";
import { HTTP_STATUS } from "../../common";
import { hashPassword } from "../../utils/password.util";
// ! src/modules/auth/auth.service.ts

export class AuthService {
  private query: AuthQuery = authQuery;

  async registerUser(data: RegisterDto) {
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

      const { password: _, ...safe } = user;
      return safe;
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
}

export const authService = new AuthService();
