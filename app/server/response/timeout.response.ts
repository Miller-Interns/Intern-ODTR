import type { Selectable } from 'kysely'
import type { TimeLog } from '../db/types'

export const createTimeoutResponse = (updatedLog: Selectable<TimeLog>) => {
	return {
		updatedLog: updatedLog,
	}
}
