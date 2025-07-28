// import { PrismaClient } from '@/generated/prisma'
import { Kysely, PostgresDialect } from 'kysely'
// import { PrismaKyselyDialect } from 'prisma-kysely'
import { Pool } from 'pg'; // Or your database driver

// Import the Kysely types that prisma-kysely generated
import type { DB } from "../../app/server/db/types";


const dialect = new PostgresDialect({
  pool: new Pool({
    // Make sure your DATABASE_URL is accessible here
    connectionString: process.env.POSTGRES_CONNECTION_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});