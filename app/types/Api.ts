import type { Selectable } from 'kysely'
import type { Batch } from '../../app/server/db/types.d.ts'
import type { InternWithDetails, InternSummary } from './InternDetails'
import type { TimeLogEntry } from './TimeLogs'

export type ActiveInternsApiResponse = {
	batch: Selectable<Batch>
	interns: InternSummary[]
}

export type ActiveInternsResponse = {
	batch?: { status?: boolean }
	interns: InternSummary[]
}

export type InternDetailsResponse = {
	intern: InternWithDetails
	timeLogs: TimeLogEntry[]
}

export type BulkApprovalApiResponse = {
	success: boolean
	message: string
}
