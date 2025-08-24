import type { Selectable } from 'kysely'
import type { TimeLog } from '../db/types'

type TimeLogWithAdmin = Selectable<TimeLog> & { adminName: string | null }

export const createInternTimeLogsResponse = (timeLogs: TimeLogWithAdmin[]) => {
	return {
		timeLogs: timeLogs,
	}
}
