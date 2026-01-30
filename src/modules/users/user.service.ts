// ! src/modules/users/user.service.ts

import { HTTP_STATUS } from "../../common";
import { ApiError, logger } from "../../utils";
import type { UserProfileCreateDto, UserProfileInfoDto, UserProfileResultRaw, UserProfileUpdateDto } from "./dto";
import { userProfileQuery, UserProfileQuery } from "./user.query";


export class UserProfileServie {
    private readonly userProfileQuery: UserProfileQuery = userProfileQuery;

    // * create user profile
    async createUserProfile(data: UserProfileCreateDto): Promise<UserProfileInfoDto> {
        // ? check for existing user
        const checkUser: UserProfileInfoDto | null = await this.userProfileQuery.findProfileByUserId(data.user_id);

        if (checkUser) {
            throw new ApiError(HTTP_STATUS.CONFLICT, 'user exist for this user id');
        }
        try {
         const userProfile: UserProfileResultRaw | null = await this.userProfileQuery.createProfile(data);
         if (!userProfile) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'failed to create user profiel');
         }

         return userProfile as UserProfileInfoDto;
        } catch (error: any) {
            logger.error(`failed to create user profie : ${error.message}\n${error}`);

            throw new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                `Failed to create user profile for internal server issue on: ${error.message}`
            );
        }

    }

    // * update user profile
    async updateUserProfile(user_id: string, data: UserProfileUpdateDto): Promise<UserProfileResultRaw>{
        const checkUser: UserProfileInfoDto | null = await this.userProfileQuery.findProfileByUserId(user_id);

        if (!checkUser) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'user exist or deleted');
        }
        try {
            const updateProfile: UserProfileResultRaw | undefined = await this.userProfileQuery.updateProfile(user_id, data);

            if (!updateProfile) {
                throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'user profile failed to update');
            }


            return updateProfile;
        } catch (error: any) {
              logger.error(`failed to update user profie : ${error.message}\n${error}`);

            throw new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                `Failed to update user profile for internal server issue on: ${error.message}`
            );
        }
    }

    // * find user by email
    async findUserByEmail(email: string): Promise<UserProfileInfoDto>{
        try {
            
            const userProfile: UserProfileInfoDto | null = await this.userProfileQuery.findProfileByEmail(email);
            if (!userProfile) {
                throw new ApiError(HTTP_STATUS.NOT_FOUND, 'invalid email or user already deleted');
            }

            return userProfile;

        } catch (error : any) {
              logger.error(`failed to find user profie for ${email}: ${error.message}\n${error}`);

            throw new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                `Failed to find user profile for internal server issue on: ${error.message}`
            );
        }
    }
    
    
    
    // * find user by phone
    async findUserByPhone(phone: string): Promise<UserProfileInfoDto>{
        try {
            
            const userProfile: UserProfileInfoDto | null = await this.userProfileQuery.findProfileByPhone(phone);
            if (!userProfile) {
                throw new ApiError(HTTP_STATUS.NOT_FOUND, 'invalid phone or user already deleted');
            }

            return userProfile;

        } catch (error : any) {
              logger.error(`failed to find user profie for ${phone}: ${error.message}\n${error}`);

            throw new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                `Failed to find user profile for internal server issue on: ${error.message}`
            );
        }
    }
    
    // * find user by userId
    async findUserByUserId(user_id: string): Promise<UserProfileInfoDto>{
        try {
            
            const userProfile: UserProfileInfoDto | null = await this.userProfileQuery.findProfileByUserId(user_id);
            if (!userProfile) {
                throw new ApiError(HTTP_STATUS.NOT_FOUND, 'invalid userIs or user already deleted');
            }

            return userProfile;

        } catch (error : any) {
              logger.error(`failed to find user profie for ${user_id}: ${error.message}\n${error}`);

            throw new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                `Failed to find user profile for internal server issue on: ${error.message}`
            );
        }
    }



}


export const userProfileService : UserProfileServie = new UserProfileServie();