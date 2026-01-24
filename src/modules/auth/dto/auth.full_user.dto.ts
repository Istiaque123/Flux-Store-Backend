// ! src/modules/auth/dto/auth.full_user.dto.ts

import type { SafeUserRaw } from './auth.safe_user.dto';

export interface FullUserRaw extends SafeUserRaw{
    password: string;
}