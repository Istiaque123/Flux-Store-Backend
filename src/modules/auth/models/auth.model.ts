// ! src/modules/auth/models/auth.model.ts

import type { PoolClient } from "pg";
import { BaseMigration } from "../../../core/tables"
import { AUTH_TABLES } from "./auth.tables.names";

export class Authentication extends BaseMigration{
    tableName: string = AUTH_TABLES.auth;

    schemaQuery: string = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID REFERENCES users(id) ON DELETE CASCADE, 

      auth_token VARCHAR(400) NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW(),


      

      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NULL,
      active BOOLEAN DEFAULT TRUE,
      status BOOLEAN DEFAULT TRUE,
      is_delete BOOLEAN DEFAULT FALSE
    );
  `;

   async postMigration(client: PoolClient): Promise<void> {
 
    }
  
}


export const authenticationTableObj: Authentication = new Authentication();