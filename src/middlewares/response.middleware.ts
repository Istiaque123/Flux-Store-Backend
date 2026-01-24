// ! src/middlewares/response.middleware.ts

import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from '../common/http-status';


export const responseMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.success = (data: any, status: number = HTTP_STATUS.OK, message:string = 'success' ): Response<any, Record<string, any>>=> {
        return res.status(status).json({
            data,
            error: false,
            status,
            message
        });
    }
    
    res.error = (status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, message:string = 'failed' ): Response<any, Record<string, any>>=> {
        return res.status(status).json({
            data: null,
            error: true,
            status,
            message
        });
    }



    next();
};