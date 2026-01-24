// ! src/config/database.migration.ts

import type { PoolClient } from "pg";
import { pool } from "./";
import { logger } from "../utils";

/* ─────────────────────────────────────────────── */
/* Types                                          */
/* ─────────────────────────────────────────────── */

interface ColumnSchema {
  type: string;
  default: string | null;
  nullable: boolean;
}

interface MigrationDefinition {
  tableName?: string;
  schemaQuery?: string;
  dataMigration?: (client: PoolClient) => Promise<void>;
  postMigration?: (client: PoolClient) => Promise<void>;
}

type MigrationMap = Record<string, MigrationDefinition>;

/* ─────────────────────────────────────────────── */
/* Migration Table                                */
/* ─────────────────────────────────────────────── */

const createMigrationTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

const getAppliedMigrations = async (): Promise<string[]> => {
  const result = await pool.query<{ name: string }>(
    "SELECT name FROM migrations"
  );
  return result.rows.map((r) => r.name);
};

/* ─────────────────────────────────────────────── */
/* Schema Helpers                                 */
/* ─────────────────────────────────────────────── */

const tableExists = async (
  client: PoolClient,
  tableName: string
): Promise<boolean> => {
  const result = await client.query<{ exists: boolean }>(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )`,
    [tableName]
  );
  return result.rows[0]?.exists ?? false;
};

const getCurrentSchema = async (
  client: PoolClient,
  tableName: string
): Promise<Record<string, ColumnSchema>> => {
  const result = await client.query(
    `
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = $1
  `,
    [tableName]
  );

  const schema: Record<string, ColumnSchema> = {};

  for (const row of result.rows) {
    schema[row.column_name] = {
      type: row.data_type,
      default: row.column_default,
      nullable: row.is_nullable === "YES",
    };
  }

  return schema;
};

const normalizeDefault = (val: string | null): string | null => {
  if (!val) return null;
  return val
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/::[a-z_]+/g, "")
    .replace(/^null$/, "")
    .replace(/^\((.*)\)$/, "$1")
    .replace(/current_timestamp\(\)/g, "now()")
    .replace(/current_timestamp/g, "now()");
};

/* ─────────────────────────────────────────────── */
/* Schema Application                             */
/* ─────────────────────────────────────────────── */

const applySchemaChanges = async (
  client: PoolClient,
  tableName: string,
  schemaQuery: string
): Promise<void> => {
  try {
    const exists = await tableExists(client, tableName);

    if (!exists) {
      logger.info(`Creating table ${tableName}`);
      await client.query(schemaQuery);
      return;
    }

    logger.info(`Table ${tableName} exists → checking for schema differences`);

    const currentSchema = await getCurrentSchema(client, tableName);

    const lines = schemaQuery
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("CREATE") && !l.startsWith(")"));

    const columnDefs = lines.filter((l) => l.endsWith(",") || l.endsWith(")"));
    const desired: Record<string, ColumnSchema> = {};

    for (const def of columnDefs) {
      const clean = def.replace(/,$/, "").trim();
      const parts = clean.split(/\s+/);

      const colName = parts[0];
      const type = parts[1];

      if (!colName || !type) continue;

      const defaultMatch = clean.match(/DEFAULT\s+([^\s,]+)/i);
      const hasNotNull = clean.includes("NOT NULL");

      desired[colName] = {
        type,
        default: defaultMatch?.[1] ?? null,
        nullable: !hasNotNull,
      };
    }

    const queries: string[] = [];

    for (const [col, want] of Object.entries(desired)) {
      const curr = currentSchema[col];

      if (!curr) {
        let q = `ALTER TABLE ${tableName} ADD COLUMN ${col} ${want.type}`;
        if (want.default) q += ` DEFAULT ${want.default}`;
        if (!want.nullable) q += ` NOT NULL`;
        queries.push(q);
        continue;
      }

      if (normalizeDefault(want.default) !== normalizeDefault(curr.default)) {
        queries.push(
          `ALTER TABLE ${tableName} ALTER COLUMN ${col} SET DEFAULT ${
            want.default ?? "NULL"
          }`
        );
      }

      if (want.nullable !== curr.nullable) {
        queries.push(
          `ALTER TABLE ${tableName} ALTER COLUMN ${col} ${
            want.nullable ? "DROP NOT NULL" : "SET NOT NULL"
          }`
        );
      }
    }

    if (queries.length > 0) {
      logger.info(`Applying ${queries.length} schema change(s) to ${tableName}`);
      for (const q of queries) {
        await client.query(q);
      }
    } else {
      logger.info(`No schema changes needed for ${tableName}`);
    }
  } catch (err) {
    logger.error(`Schema change failed for ${tableName}: ${err}`);
    throw err;
  }
};

/* ─────────────────────────────────────────────── */
/* Apply Migration                                */
/* ─────────────────────────────────────────────── */

const applyMigration = async (
  name: string,
  migration: MigrationDefinition,
  options: { force?: boolean; recheckExistence?: boolean } = {}
): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let shouldApply = options.force ?? false;

    // Development safety: re-apply if table is missing
    if (options.recheckExistence && migration.tableName && migration.schemaQuery) {
      const exists = await tableExists(client, migration.tableName);
      if (!exists) {
        logger.warn(
          `Table ${migration.tableName} is missing → forcing migration`
        );
        shouldApply = true;
      }
    }

    if (shouldApply && migration.schemaQuery && migration.tableName) {
      await applySchemaChanges(
        client,
        migration.tableName,
        migration.schemaQuery
      );
    }

    if (shouldApply && migration.dataMigration) {
      await migration.dataMigration(client);
    }

    if (shouldApply && migration.postMigration) {
      await migration.postMigration(client);
    }

    // Only mark as applied if we actually ran something
    if (shouldApply) {
      await client.query(
        "INSERT INTO migrations (name) VALUES ($1) ON CONFLICT DO NOTHING",
        [name]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/* ─────────────────────────────────────────────── */
/* Runner                                         */
/* ─────────────────────────────────────────────── */

export const runMigrations = async (
  migrations: MigrationMap,
  options: { force?: boolean; recheckExistence?: boolean } = {}
): Promise<void> => {
  await createMigrationTable();
  const applied = await getAppliedMigrations();

  const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined;
  const effectiveRecheck = options.recheckExistence ?? isDev;

  logger.info(
    `Running migrations (force: ${!!options.force}, recheck: ${effectiveRecheck})`
  );

  for (const [name, migration] of Object.entries(migrations)) {
    const wasApplied = applied.includes(name);
    if (!wasApplied || options.force || effectiveRecheck) {
      await applyMigration(name, migration, {
        force: options.force ?? false,
        recheckExistence: effectiveRecheck,
      });
    } else {
      logger.info(`Skipping already applied migration: ${name}`);
    }
  }
};