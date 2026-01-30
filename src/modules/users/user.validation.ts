// ! src/modules/users/user.validation.ts

import Joi from "joi";

export const createUserProfileSchema: Joi.ObjectSchema<any> = Joi.object({

    user_id: Joi.string().uuid().trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    phone: Joi.string().min(11).max(11).required(),
    name: Joi.string().trim().min(3).required(),
    address: Joi.string().trim().min(4).required(),
});

export const updateUserProfileSchema: Joi.ObjectSchema<any> = Joi.object({
    user_id: Joi.string().uuid().trim().required(),

    phone: Joi.string().min(11).max(11).optional().allow(null, ''),
    name: Joi.string().trim().min(3).optional().allow(null, ''),
    address: Joi.string().trim().min(4).optional().allow(null, ''),
}).min(1);

export const findUserProfileByEmailSchema: Joi.ObjectSchema<any> = Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
});

export const findUserProfileByPhoneSchema: Joi.ObjectSchema<any> = Joi.object({
    phone: Joi.string().min(11).max(11).required(),
});

export const findUserProfileByUserIdSchema: Joi.ObjectSchema<any> = Joi.object({
    user_id: Joi.string().uuid().trim().required(),
});