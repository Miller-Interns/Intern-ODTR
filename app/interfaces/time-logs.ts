import type { TimeLog } from '~/generated/prisma'
import type { Selectable } from 'kysely'

export interface RawPendingLogQueryResult {
	id: string
	intern_id: string
	admin_id: string | null
	status: boolean
	admin_remarks: string | null
	intern_notes: string | null
	time_in: Date
	time_out: Date | null
	total_hours: number
	intern_name: string | null
	intern_role: string
	intern_picture: string | null
}

export interface TimeLogEntry extends Omit<Selectable<TimeLog>, 'time_in' | 'time_out'> {
	time_in: string
	time_out: string | null
}

export interface ApproveLogPayload {
	logId: string
	admin_remarks: string | null
}

export interface BulkApprovePayload {
  logs: ApproveLogPayload[];
}

