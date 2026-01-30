// ! src/modules/auth/auth.query.ts

import { UserRoles } from "../../common";
import { DBQuery } from "../../config";
import { UserTables } from "../users/models";
import type { AuthroizationRaw, FullUserRaw, SafeUserRaw, UserSessionResDto } from "./dto";
import { AUTH_TABLES } from "./models";


// ! Auth Query
export class AuthQuery {
  private userTable: string = UserTables.USERS;
  private readonly userProfileTable: string = UserTables.USERS_PROFILE;
  private authorizeTable: string = AUTH_TABLES.auth;

  // * Authentication record for login
  async storeRefreshToken(
    data: {
       user_id: string;
       auth_token: string; 
       timestamp?: Date
       }
      ): Promise<AuthroizationRaw | null> {
    return DBQuery.insert<AuthroizationRaw>(
      this.authorizeTable, {
      user_id: data.user_id,
      auth_token: data.auth_token,
      timestamp: data.timestamp ?? new Date(),
    });
  }

  // * create user or register
  async registerUser(data: {
    email: string;
    password: string;
  }): Promise<SafeUserRaw | null> {
    return DBQuery.insert<SafeUserRaw>(this.userTable, {
      email: data.email,
      password: data.password,
      role: UserRoles.user,
    });
  }

  // * create admin or register
  async registerAdmin(data: {
    email: string;
    password: string;
    confirm_passwrod: string;
  }): Promise<SafeUserRaw | null> {
    return DBQuery.insert<SafeUserRaw>(this.userTable, {
      email: data.email,
      password: data.password,
      role: UserRoles.admin,
    });
  }

  //   * Find auth user by email
  async findByEmail(email: string): Promise<FullUserRaw | null> {
    return DBQuery.findOne<FullUserRaw>(
      this.userTable,
      ["id", "email", "role", 'password', "created_at", "updated_at"],
      {
        email,
        is_delete: false,
      }
    );
  }

  //   * find auth user by id
  async findById(id: string): Promise<FullUserRaw | null> {
    return DBQuery.findOne<FullUserRaw>(
      this.userTable,
      ["id", "email", "role", 'password', "created_at", "updated_at"],
      { id, is_delete: false }
    );
  }

  //  * update user password
  async updatePassword(
    user_id: string,
    hashedPassword: string
  ): Promise<boolean> {
    const [updated]: FullUserRaw[] = await DBQuery.update<FullUserRaw>(
      this.userTable,
      {
        password: hashedPassword,
        updated_at: new Date(),
      },
      { 
        id: user_id,
        is_delete: false
       }
    );

    return !!updated;
  }

  // * forget password and update by email

  async restorePassword(
    email: string,
    password: string,
  ): Promise<FullUserRaw | null>{
    const result: FullUserRaw[] = await DBQuery.update<FullUserRaw>(
      this.userTable, {
        password: password,
        updated_at: new Date(),
      },{
        email: email,
        is_delete: false
      },
    )
   return result[0] || null;

    
  }

  async userSession(user_id: string): Promise<UserSessionResDto | null>{
    const query = `
    SELECT
      u.id AS user_id,
      u.email,
      u.role,
      u.created_at AS user_created_at,
      p.name,
      p.phone,
      p.address,
      p.created_at AS profile_created_at,
      p.updated_at AS profile_updated_at
    FROM ${this.userTable} u
    LEFT JOIN ${this.userProfileTable} p
      ON p.user_id = u.id AND p.is_delete = FALSE
    WHERE u.id = $1
      AND u.is_delete = FALSE
    LIMIT 1
    `;

    const rows: UserSessionResDto[] = await DBQuery.query<UserSessionResDto>(
      query, [user_id]
    );

    return rows[0] || null;
  }


}

// Singleton instance (recommended pattern)
export const authQuery = new AuthQuery();
