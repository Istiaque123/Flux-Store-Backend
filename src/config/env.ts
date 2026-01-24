// ! src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

export const env = {
  // ? server port
  PORT: process.env.PORT || 3000,

  // ? Public Directorey and assets
  PUBLIC_DIR: process.env.PUBLIC_DIR || 'public',



  // ? JWT Token secret
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "secret",

  // ? DATABSE
  // * use if has url
  DATABASE_URL: process.env.DATABASE_URL || "",

  DATABASE_USER: process.env.DB_USER || 'postgres',
  DATABASE_HOST: process.env.DB_HOST || 'localhost',
  DATABASE_DATABASE: process.env.DB_DATABASE || 'test_db',
  DATABASE_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DATABASE_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
};


