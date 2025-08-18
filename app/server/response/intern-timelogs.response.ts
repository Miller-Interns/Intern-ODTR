import type { Selectable } from 'kysely'
import type { TimeLog } from '../db/types'

// Define the shape of the data coming from the service
type TimeLogWithAdmin = Selectable<TimeLog> & { adminName: string | null }

/**
 * Formats the array of time log objects into the specific structure
 * required by the time logs list API endpoint.
 */
export const createInternTimeLogsResponse = (timeLogs: TimeLogWithAdmin[]) => {
	return {
		timeLogs: timeLogs,
	}
}
