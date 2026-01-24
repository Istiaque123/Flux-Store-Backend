// ! src/modules/users/models/users_profile.model.ts

import type { PoolClient } from "pg";  // Use "pg" instead of "node-postgres" for consistency
import { BaseMigration } from '../../../core/tables/base.migration';
import { UserTables } from './users_tables_names';

export class UserProfile extends BaseMigration {
  tableName: string = UserTables.USERS_PROFILE;

  schemaQuery: string = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Added NOT NULL (required for FK)

      name TEXT NOT NULL,
      phone varchar(100) NOT NULL UNIQUE,  
      email TEXT DEFAULT NULL UNIQUE,      
      address TEXT DEFAULT NULL,

      

      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NULL,
      active BOOLEAN DEFAULT TRUE,
      status BOOLEAN DEFAULT TRUE,
      is_delete BOOLEAN DEFAULT FALSE
    );
  `;

  // Optional: Custom post-migration (uncomment when ready)
  async postMigration(client: PoolClient): Promise<void> {
    // Call base if you have common indexes there
    // await super.postMigration(client);

    // Custom index for fast email lookups (login/search)
    // await client.query(`
    //   CREATE INDEX IF NOT EXISTS idx_${this.tableName}_email 
    //   ON ${this.tableName}(email);
    // `);
  }
}

// Export instance
export const userProfileObj: UserProfile = new UserProfile();