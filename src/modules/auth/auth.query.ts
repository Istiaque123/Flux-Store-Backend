// ! src/modules/auth/auth.query.ts

import { UserRoles } from "../../common";
import { DBQuery } from "../../config";
import { UserTables } from "../users/models";
import type { FullUserRaw, SafeUserRaw } from "./dto";


// ! Auth Query
export class AuthQuery {
  private userTable: string = UserTables.USERS;


  // * create user or register
  async registerUser(data: {
    email: string;
    password: string;
  }): Promise<SafeUserRaw | null> {
    console.log("hit");
    
    return DBQuery.insert<SafeUserRaw>(
        this.userTable, {
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
        this.userTable, [
            "id", 
            "email", 
            "role", 
            "created_at", 
            "updated_at",
        ], { 
            email, 
            is_delete: false
         }
    );
  }

//   * find auth user by id
  async findById(id: string): Promise<SafeUserRaw | null> {
    return DBQuery.findOne<SafeUserRaw>(
      this.userTable,
      ["id", "email", "role", "created_at", "updated_at"],
      { id, is_delete: false }
    );
  }


//  * update user password
    async updatePassword(user_id: string, hashedPassword: string): Promise<boolean>{
        const [updated]: FullUserRaw[] = await DBQuery.update<FullUserRaw>(
            this.userTable,
            {
                password: hashedPassword,
                updated_at: new Date(),
            },
            { id: user_id }
        );

        return !!updated;
    }

}

// Singleton instance (recommended pattern)
export const authQuery = new AuthQuery();