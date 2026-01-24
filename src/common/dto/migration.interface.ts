// ! src/common/dto/migration.interface.ts

import type { PoolClient } from "pg";

export interface MigrationDefination {
  tableName: string;
  schemaQuery: string;
  
  dataMigration?: (client: PoolClient) => Promise<void>;
  postMigration?: (client: PoolClient) => Promise<void>;
}
