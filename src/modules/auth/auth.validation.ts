// src/modules/auth/auth.validator.ts
import Joi from "joi";

export const registerSchema: Joi.ObjectSchema<any> = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(4).max(128).required(),
  confirm_password: Joi.string().min(4).max(128).required(),
});

export const loginSchema: Joi.ObjectSchema<any> = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema: Joi.ObjectSchema<any> = Joi.object({
  refreshToken: Joi.string().required(),
});