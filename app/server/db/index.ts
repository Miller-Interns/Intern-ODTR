import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { DB } from './types'

const config = useRuntimeConfig()

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: config.POSTGRES_CONNECTION_URL as string,
		}),
	}),
})