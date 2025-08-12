import { Kysely, Transaction } from 'kysely'
import jwt from 'jsonwebtoken'
import type { DB } from '../db/types'

export type RequestContext = {
	auth: {
		userId?: string | jwt.JwtPayload
	}
	trx?: Transaction<DB> | Kysely<DB>
}
