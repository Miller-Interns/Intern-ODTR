import type { Selectable } from 'kysely'
import type { Intern, TimeLog } from '../db/types'

// Define the shape of the data this formatter will receive
interface TimeLogResponseInput {
	intern: Selectable<Intern>
	activeTimeLog: Selectable<TimeLog> | null | undefined
	lastCompletedLog: Selectable<TimeLog> | null | undefined
}

/**
 * Formats the raw database objects into the specific structure
 * required by the dashboard API endpoint.
 */
export const createCurrentTimeLogResponse = (data: TimeLogResponseInput) => {
	const { intern, activeTimeLog, lastCompletedLog } = data

	return {
		activeTimeLog,
		lastCompletedLog,
		internStatus: intern.status,
		requiredHours: intern.required_hours,
		renderedHours: intern.hours_completed,
	}
}
