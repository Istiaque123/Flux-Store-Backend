// ! src/modules/auth/auth.controller.ts

import type {Request, Response} from 'express';
import { validate } from '../../utils';
import { forgerPasswordSchema, loginSchema, registerSchema, updatePasswordSchema } from './auth.validation';
import { HTTP_STATUS, REQUEST_SORUCE } from '../../common';
import { AuthService, authService } from './auth.service';
import type { ForgetPasswordDto, FullUserRaw, LoginDto, LoginResponseDto, RegisterDto, RegisterResposeDto, UpdatePasswordDto, UpdatePasswordResponseDto, UserSessionResDto } from './dto';


export class AuthController {

    private service: AuthService = authService;

    // * register user
    async registerUser(req: Request, res: Response): Promise<void>{
        
        const data: RegisterDto = validate(registerSchema, req, [REQUEST_SORUCE.body]);

        const user: RegisterResposeDto = await this.service.registerUser(data);

        res.success(user, HTTP_STATUS.CREATED, "Registration successful");
    }

    // * login user
    async loginUser(req: Request, res: Response): Promise<void>{

        const data: LoginDto = validate(loginSchema, req, [REQUEST_SORUCE.body]);
        const result: LoginResponseDto = await this.service.loginUser(data);

        res.success(result, HTTP_STATUS.OK, 'Login successful')
    }

    // * update password
    async updatePassword(req:Request, res: Response):Promise<void>{
 
        
        const data: UpdatePasswordDto = validate(updatePasswordSchema, req, [REQUEST_SORUCE.body]);

        const result: UpdatePasswordResponseDto = await this.service.updatePassword(data);

        res.success(result, HTTP_STATUS.ACCEPTED, 'user password update successful');
    }


    // * forget password
    async forgerPassword(req: Request, res: Response):Promise<void>{
        const data: ForgetPasswordDto = validate(forgerPasswordSchema, req, [
            REQUEST_SORUCE.body,
        ]);

        const result: UpdatePasswordResponseDto = await this.service.forgetPassword(data);

        res.success(result, HTTP_STATUS.OK, "Pssword reset successful");
    }
    

    // * get user session
    async getUserSession(req: Request, res: Response):Promise<void>{
        const user_id: string | undefined = req.user?.id;

        if (!user_id) {
            res.error(HTTP_STATUS.UNAUTHORIZED, "Not Authorize");
        }

        const result : UserSessionResDto = await this.service.getUserSession(user_id!);

        res.success(result, HTTP_STATUS.OK, "Session info retrieved")
    }

}

export const authController = new AuthController();