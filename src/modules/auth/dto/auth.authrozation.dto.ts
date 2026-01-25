// ! src/modules/auth/dto/auth.authrozation.dto.ts
import type {QueryResultRow} from 'pg';

export interface AuthroizationRaw extends QueryResultRow {

    id: string;
    user_id: string;
    auth_token: string;
    timestamp: Date;

}