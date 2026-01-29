// ! src/modules/otp/models/otp.model.ts

import type { PoolClient } from "pg";
import { BaseMigration } from "../../../core/tables";
import { OTP_TABLES } from "./otp_models.name";


export class Otp extends BaseMigration {
  tableName: string = OTP_TABLES.otp;

  schemaQuery: string = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT,                      
      phone VARCHAR(100),               
      otp_code VARCHAR(16) NOT NULL,     
      expires_at TIMESTAMPTZ NOT NULL,  
      is_used BOOLEAN DEFAULT FALSE,
      used_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NULL,
      active BOOLEAN DEFAULT TRUE,
      status BOOLEAN DEFAULT TRUE,
      is_delete BOOLEAN DEFAULT FALSE
    );

    -- Indexes for fast lookup
    CREATE INDEX IF NOT EXISTS idx_otp_email_code 
    ON ${this.tableName} (email, otp_code, is_used, expires_at)
    WHERE is_delete = FALSE AND is_used = FALSE;
  `;

  async postMigration(client: PoolClient): Promise<void> {
    // Optional: add more indexes if needed
  }
}

export const otpTableObj = new Otp();