// ! src/modules/users/dto/query_result_dtos/user_profile_result_row.dto.ts

import type { QueryResultRow } from "pg";

export interface UserProfileResultRaw extends QueryResultRow {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;

  created_at: Date;
  updated_at?: Date | null;
}
