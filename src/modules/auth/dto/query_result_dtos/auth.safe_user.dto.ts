// ! src/modules/auth/dto/query_result_dtos/auth.safe_user.dto.ts

import type {QueryResultRow} from "pg";

export interface SafeUserRaw extends QueryResultRow {
  id: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at?: Date | null;
}