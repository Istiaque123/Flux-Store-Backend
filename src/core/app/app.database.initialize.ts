// ! src/core/app/app.database.initialize.ts

import { pool } from "../../config";
import { runMigrations } from "../../config/database.migration";  // Fixed import if needed
import { logger } from "../../utils";

export async function initializeDatabase(): Promise<void> {
  try {
    // Test connection
    await pool.query('SELECT 1');
    logger.info('PostgreSQL connected');
    
    // Enable pgcrypto extension (required for UUIDs)
    await enablePgcryptoExtension();
    
  } catch (err) {
    logger.error(`PostgreSQL connection failed: ${err}`);
    throw err;
  }
}

async function enablePgcryptoExtension(): Promise<void> {
  const queryText = 'CREATE EXTENSION IF NOT EXISTS pgcrypto;';
  try {
    await pool.query(queryText);
    logger.info("pgcrypto extension enabled successfully.");
  } catch (err) {
    logger.error(`Error enabling pgcrypto extension: ${err}`);
    throw err;
  }
}



export async function initializeTablesMigration(
  tableDefinitions: any,
  options: { force?: boolean; recheckExistence?: boolean } = {}
): Promise<void> {
  try {
    await runMigrations(tableDefinitions, options);
    logger.info("Migrations completed");
  } catch (err) {
    console.error("Error applying migrations:", err);
    throw err;
  }
}
