// ! src/modules/users/user.controller.ts

import type { Request, Response } from "express";
import { userProfileService, UserProfileServie } from "./user.service";
import { validate } from "../../utils";
import {
  createUserProfileSchema,
  findUserProfileByEmailSchema,
  findUserProfileByPhoneSchema,
  findUserProfileByUserIdSchema,
  updateUserProfileSchema,
} from "./user.validation";
import { HTTP_STATUS, REQUEST_SORUCE } from "../../common";
import type {
  UserProfileCreateDto,
  UserProfileInfoDto,
  UserProfileResultRaw,
  UserProfileUpdateDto,
} from "./dto";

export class UserProfileController {
  private readonly userProfileService: UserProfileServie = userProfileService;

  // * create user profile
  async createUserProfile(req: Request, res: Response): Promise<void> {
    const data: UserProfileCreateDto = validate(createUserProfileSchema, req, [
      REQUEST_SORUCE.body,
    ]);

    const result: UserProfileInfoDto =
      await this.userProfileService.createUserProfile(data);

    res.success(
      result,
      HTTP_STATUS.CREATED,
      "User profile created successfully"
    );
  }

  // * update user profile
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    const validateRequest: UserProfileUpdateDto & {
      user_id: string;
    } = validate<UserProfileUpdateDto & { user_id: string }>(
      updateUserProfileSchema,
      req,
      [REQUEST_SORUCE.body, REQUEST_SORUCE.params]
    );

    
    const { user_id, ...data } = validateRequest;

    const result: UserProfileResultRaw =
      await this.userProfileService.updateUserProfile(
        validateRequest.user_id,
        data
      );

    res.success(result, HTTP_STATUS.ACCEPTED, "user profile update successfully");
  }

  // * find user profile by email
  async findUserProfileByEmail(req: Request, res: Response): Promise<void> {
    const data: { email: string } = validate<{ email: string }>(findUserProfileByEmailSchema, 
        req,
        [REQUEST_SORUCE.params],
    );

    const result: UserProfileInfoDto = await this.userProfileService.findUserByEmail(data.email);

    res.success(result, HTTP_STATUS.OK, "user profile found successfully");
  }


  // * find user profile by phone
  async findUserProfileByPhone(req: Request, res: Response): Promise<void> {
    const data: { phone: string } = validate<{ phone: string }>(findUserProfileByPhoneSchema, 
        req,
        [REQUEST_SORUCE.params],
    );

    const result: UserProfileInfoDto = await this.userProfileService.findUserByPhone(data.phone);

    res.success(result, HTTP_STATUS.OK, "user profile found successfully");
  }


  // * find user profile by userId
  async findUserProfileByUserId(req: Request, res: Response): Promise<void> {
    const data: { user_id: string } = validate<{ user_id: string }>(findUserProfileByUserIdSchema, 
        req,
        [REQUEST_SORUCE.params],
    );

    const result: UserProfileInfoDto = await this.userProfileService.findUserByUserId(data.user_id);

    res.success(result, HTTP_STATUS.OK, "user profile found successfully");
  }


}


export const userProfileController: UserProfileController = new UserProfileController();