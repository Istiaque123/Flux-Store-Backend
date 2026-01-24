// ! src/modules/auth/dto/auth.safe_user.dto.ts

import type {QueryResultRow} from "pg";

export interface SafeUserRaw extends QueryResultRow {
  id: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at?: Date | null;
}