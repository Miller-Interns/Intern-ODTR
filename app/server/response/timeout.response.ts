import type { Selectable } from 'kysely'
import type { TimeLog } from '../db/types'

/**
 * Formats the updated time log object into the specific structure
 * required by the timeout API endpoint.
 */
export const createTimeoutResponse = (updatedLog: Selectable<TimeLog>) => {
	return {
		updatedLog: updatedLog,
	}
}
