// ! src/config/database.query.ts

import type { PoolClient, QueryResult, QueryResultRow } from "pg";
import { pool } from "./";

// ! Helper to safely quote identifiers (table/column names)
function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

export class DBQuery {
  // ! ───────────────────────────────────────────────
  // ! INSERT
  // ! ───────────────────────────────────────────────
  static async insert<T extends QueryResultRow = any>(
    table: string,
    data: Record<string, any>,
    options: { client?: PoolClient } = {}
  ): Promise<T | null> {
    const queryExecutor = options.client ?? pool;

    if (Object.keys(data).length === 0) {
      throw new Error("Cannot insert empty object");
    }

    const sanitized = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        v === "" || v === undefined ? null : v,
      ])
    );

    const keys = Object.keys(sanitized);
    const values = Object.values(sanitized);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${quoteIdentifier(table)} (${keys
        .map(quoteIdentifier)
        .join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await queryExecutor.query<T>(query, values);
    return result.rows[0] ?? null;
  }

  // ! ───────────────────────────────────────────────
  // ! FIND (many)
  // ! ───────────────────────────────────────────────
  static async find<T extends QueryResultRow = any>(
    table: string,
    fields: string[] = [],
    condition: Record<string, any> = {},
    options: { client?: PoolClient } = {}
  ): Promise<T[]> {
    const queryExecutor = options.client ?? pool;

    const selected =
      fields.length > 0 ? fields.map(quoteIdentifier).join(", ") : "*";

    const condEntries = Object.entries(condition);
    const whereParts: string[] = [];

    if (condEntries.length > 0) {
      whereParts.push(
        ...condEntries.map(
          ([key], i) => `${quoteIdentifier(key)} = $${i + 1}`
        )
      );
    }

    // Soft delete filter
    whereParts.push("is_delete = FALSE");

    const whereClause =
      whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

    const query = `
      SELECT ${selected}
      FROM ${quoteIdentifier(table)}
      ${whereClause};
    `;

    const values = condEntries.map(([, v]) => v);

    const result = await queryExecutor.query<T>(query, values);
    return result.rows;
  }

  // ! ───────────────────────────────────────────────
  // ! FIND ONE
  // ! ───────────────────────────────────────────────
  static async findOne<T extends QueryResultRow = any>(
    table: string,
    fields: string[] = [],
    condition: Record<string, any> = {},
    options: { client?: PoolClient } = {}
  ): Promise<T | null> {
    const rows = await this.find<T>(table, fields, condition, options);
    return rows[0] ?? null;
  }

  // ! ───────────────────────────────────────────────
  // ! UPDATE
  // ! ───────────────────────────────────────────────
  static async update<T extends QueryResultRow = any>(
    table: string,
    data: Record<string, any>,
    condition: Record<string, any> = {},
    options: { client?: PoolClient } = {}
  ): Promise<T[]> {
    const queryExecutor = options.client ?? pool;

    if (Object.keys(data).length === 0) {
      throw new Error("No fields to update");
    }

    const sanitized: {
      [k: string]: any;
    } = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        v === "" || v === undefined ? null : v,
      ])
    );

    const dataKeys:  string[] = Object.keys(sanitized);
    const dataValues: any[] = Object.values(sanitized);

    const condEntries: [string, any][] = Object.entries(condition);
    const condValues: any[] = condEntries.map(([, v]) => v);

    const setParts: string[] = dataKeys.map(
      (key, i) => `${quoteIdentifier(key)} = $${i + 1}`
    );

    const whereParts = condEntries.map(
      ([key], i) =>
        `${quoteIdentifier(key)} = $${dataKeys.length + i + 1}`
    );

    const query = `
      UPDATE ${quoteIdentifier(table)}
      SET ${setParts.join(", ")}
      ${whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : ""}
      RETURNING *;
    `;

    const result: QueryResult<T> = await queryExecutor.query<T>(query, [
      ...dataValues,
      ...condValues,
    ]);

    return result.rows;
  }

  // ! ───────────────────────────────────────────────
  // ! SOFT DELETE
  // ! ───────────────────────────────────────────────
  static async softDelete<T extends QueryResultRow = any>(
    table: string,
    condition: Record<string, any>,
    options: { client?: PoolClient; updated_at?: boolean } = {}
  ): Promise<T[]> {
    if (Object.keys(condition).length === 0) {
      throw new Error("Condition required for soft delete");
    }

    const data: Record<string, any> = { is_delete: true };

    if (options.updated_at !== false) {
      data.updated_at = new Date();
    }

    return this.update<T>(table, data, condition, options);
  }

  // ! ───────────────────────────────────────────────
  // ! RAW QUERY
  // ! ───────────────────────────────────────────────
  static async query<T extends QueryResultRow = any>(
    sql: string,
    params: any[] = [],
    options: { client?: PoolClient } = {}
  ): Promise<T[]> {
    const queryExecutor = options.client ?? pool;
    const result = await queryExecutor.query<T>(sql, params);
    return result.rows;
  }

  // ! ───────────────────────────────────────────────
  // ! TRANSACTION CLIENT
  // ! ───────────────────────────────────────────────
  static async getClient(): Promise<PoolClient> {
    return pool.connect();
  }
}
