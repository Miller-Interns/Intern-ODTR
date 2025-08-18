import type { Kysely } from 'kysely'
import type { DB } from '../../db/types'
import type { ActiveInternsApiResponse } from '../../../types/Api'
import type { InternSummary } from '../../../types/Intern'
import { getActiveBatch, getInternsByBatchId } from '../../service/active-intern.service'

export async function getActiveInterns(db: Kysely<DB>): Promise<ActiveInternsApiResponse> {
	const activeBatch = await getActiveBatch(db)

	if (!activeBatch) {
		throw new Error('No active batch found.')
	}

	const internsData = await getInternsByBatchId(db, activeBatch.id)

	const interns: InternSummary[] = internsData.map((row) => {
		const { name, email, batch_number, completed_hours, ...internBase } = row

		const required = internBase.required_hours || 0
		const remaining_hours = required - completed_hours

		return {
			...internBase,
			user: { name, email },
			batch: { batch_number },
			completed_hours,
			remaining_hours,
		}
	})

	return {
		batch: activeBatch,
		interns: interns,
	}
}
