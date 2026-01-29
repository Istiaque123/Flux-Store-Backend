// ! src/modules/otp/dto/query_result_dtos/otp_result_row.ts

import type { QueryResultRow } from 'pg';



export interface OtpRow extends QueryResultRow {
    id: string;
    email?: string | null;
    phone?: string | null;
    otp_code: string;
    is_used: boolean;
    used_at?: Date | null;
    created_at: Date;
}