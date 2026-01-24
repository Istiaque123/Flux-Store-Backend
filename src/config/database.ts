// ! src/config/database.ts


import { Pool } from "pg";
import { env } from "./env";



export const pool = new Pool ({
    user: env.DATABASE_USER,
    host: env.DATABASE_HOST,
    database: env.DATABASE_DATABASE,
    password: env.DATABASE_PASSWORD,
    port: env.DATABASE_PORT,
});