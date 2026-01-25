
import type {Request, Response} from 'express';
import { validate } from '../../utils';
import { loginSchema, registerSchema } from './auth.validation';
import { HTTP_STATUS, REQUEST_SORUCE } from '../../common';
import { authService } from './auth.service';
import type { LoginDto, LoginResponseDto, RegisterDto, RegisterResposeDto } from './dto';

// ! src/modules/auth/auth.controller.ts

export class AuthController {
    // * register user
    async registerUser(req: Request, res: Response): Promise<void>{
        
        const data: RegisterDto = validate(registerSchema, req, [REQUEST_SORUCE.body]);

        const user: RegisterResposeDto = await authService.registerUser(data);

        res.success(user, HTTP_STATUS.CREATED, "Registration successful");
    }

    // * login user
    async loginUser(req: Request, res: Response){

        const data: LoginDto = validate(loginSchema, req, [REQUEST_SORUCE.body]);
        const result: LoginResponseDto = await authService.loginUser(data);

        res.success(result, HTTP_STATUS.OK, 'Login successful')
    }

}

export const authController = new AuthController();