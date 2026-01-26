// src/modules/auth/auth.validator.ts
import Joi from "joi";
import type { LoginDto, RegisterDto, UpdatePasswordDto } from "./dto";

export const registerSchema: Joi.ObjectSchema<RegisterDto> = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(4).max(128).required(),
  confirm_password: Joi.string().min(4).max(128).required(),
});

export const loginSchema: Joi.ObjectSchema<LoginDto> = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema: Joi.ObjectSchema<any> = Joi.object({
  refreshToken: Joi.string().required(),
});

export const updatePasswordSchema: Joi.ObjectSchema<UpdatePasswordDto> = Joi.object({
  user_id: Joi.string().uuid().required(),
  old_password: Joi.string().trim().min(4).max(128).required(),
  new_password: Joi.string().trim().min(4).max(128).required(),

});