// ! src/modules/users/user.query.ts

import { DBQuery } from "../../config";
import type {
  UserProfileCreateDto,
  UserProfileInfoDto,
  UserProfileResultRaw,
  UserProfileUpdateDto,
} from "./dto";
import { UserTables } from "./models";

// ! User Query

export class UserProfileQuery {
  private userProfileTable: string = UserTables.USERS_PROFILE;

  // * create userProfile
  async createProfile(
    data: UserProfileCreateDto
  ): Promise<UserProfileResultRaw | null> {
    return DBQuery.insert<UserProfileResultRaw>(this.userProfileTable, data);
  }

  // * update user profile
  async updateProfile(user_id: string, data: UserProfileUpdateDto): Promise<UserProfileResultRaw | undefined> {
    const updateFields: Record<string, any> = {}
    const allowFields: (keyof UserProfileUpdateDto)[] = [
      "phone",
      "name",
      "address",
    ];

    for (const field of allowFields) {
      if (data[field] !== undefined) {
        updateFields[field] = data[field];
      }
    }

    updateFields.updated_at = new Date();

    const result: UserProfileResultRaw[] = await DBQuery.update<UserProfileResultRaw>(
      this.userProfileTable,
      updateFields, {
      user_id: user_id,
      is_delete: false
    }
    );

    return result[0];

  }

  // * find user profile by email
  async findProfileByEmail(email: string): Promise<UserProfileInfoDto | null > {
    return DBQuery.findOne<UserProfileInfoDto>(
      this.userProfileTable,
      [
        "id",
        "user_id",
        "name",
        "phone",
        'email',
        "address",
      ], {
        email: email,
        is_delete: false,
      }
    );
  }
  
  // * find user profile by phone
  async findProfileByPhone(phone: string): Promise<UserProfileInfoDto | null > {
    return DBQuery.findOne<UserProfileInfoDto>(
      this.userProfileTable,
      [
        "id",
        "user_id",
        "name",
        "phone",
        'email',
        "address",
      ], {
        phone: phone,
        is_delete: false,
      }
    );
  }
  
  
  // * find user profile by user id
  async findProfileByUserId(user_id: string): Promise<UserProfileInfoDto | null > {
    return DBQuery.findOne<UserProfileInfoDto>(
      this.userProfileTable,
      [
        "id",
        "user_id",
        "name",
        "phone",
        'email',
        "address",
      ], {
        user_id: user_id,
        is_delete: false,
      }
    );
  }


}


export const userProfileQuery: UserProfileQuery = new UserProfileQuery();

