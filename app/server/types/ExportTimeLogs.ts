import type { TimeLog, Intern } from '../db/types'

export type ExportInternTimelogsResult = {
	intern: {
		name: string
		officialHours: string
	}
	timelogs: {
		time_in: Date
		time_out: Date
		total_hours: number
		approved_by: string
	}[]
}
