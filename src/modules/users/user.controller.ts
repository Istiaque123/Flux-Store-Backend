// ! src/modules/users/user.controller.ts

import type { Request, Response } from 'express';
import { userProfileService, UserProfileServie } from './user.service';
import { validate } from '../../utils';
import { createUserProfileSchema } from './user.validation';
import { HTTP_STATUS, REQUEST_SORUCE } from '../../common';
import type { UserProfileCreateDto, UserProfileInfoDto } from './dto';


export class UserProfileController {
    private readonly userProfileService: UserProfileServie = userProfileService;


    // * create user profile
    async createUserProfile(req: Request, res: Response): Promise<void>{

        const data: UserProfileCreateDto  = validate(createUserProfileSchema, req, [REQUEST_SORUCE.body]);

        const result: UserProfileInfoDto = await this.userProfileService.createUserProfile(data);

        res.success(result, HTTP_STATUS.CREATED, "User profile created successfully");
    }


    // * update user profile
    async updateUserProfile(req: Request, res: Response): Promise<void>{
        
    }


}