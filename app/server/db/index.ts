import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { DB } from './types'

const connectionString = process.env.POSTGRES_CONNECTION_URL

if (!connectionString) {
	throw new Error("POSTGRES_CONNECTION_URL environment variable is not set.")
}

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: connectionString,
	}),
})

export const db = new Kysely<DB>({
	dialect,
})