import type { Selectable } from 'kysely'
import type { Intern, TimeLog } from '../db/types'

interface TimeLogResponseInput {
	intern: Selectable<Intern>
	activeTimeLog: Selectable<TimeLog> | null | undefined
	lastCompletedLog: Selectable<TimeLog> | null | undefined
}

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
