// ! src/modules/otp/otp.validation.ts


import Joi from 'joi';

export const sendOtpEmailSchema: Joi.ObjectSchema<any> = Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
});


export const sendOtpPhoneSchema:  Joi.ObjectSchema<any> = Joi.object({
    phone: Joi.string().trim().required(),
});