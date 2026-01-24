
import type {Request, Response} from 'express';
import { validate } from '../../utils';
import { registerSchema } from './auth.validation';
import { HTTP_STATUS, REQUEST_SORUCE } from '../../common';
import { authService } from './auth.service';
import type { RegisterDto } from './dto';
// ! src/modules/auth/auth.controller.ts

export class AuthController {
    async retisgerUser(req: Request, res: Response){
        
        const data: RegisterDto = validate(registerSchema, req, [REQUEST_SORUCE.body]);

        const user = await authService.registerUser(data);

        res.success(user, HTTP_STATUS.CREATED, "Registration successful");
    }
}

export const authController = new AuthController();