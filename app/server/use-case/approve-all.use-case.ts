import type { Kysely } from 'kysely'
import type { DB } from '~/server/db/types'
import { approveLog } from '~/server/service/approve-log.service'

export async function useApproveAllLogs(db: Kysely<DB>, logIds: string[], remarks: string | null, adminId: string) {
	try {
		await db.transaction().execute(async (trx) => {
			const approvalJobs = logIds.map((id) => approveLog(trx, id, remarks, adminId))
			await Promise.all(approvalJobs)
		})
	} catch (error) {
		console.error('Transaction failed during bulk approval:', error)
		throw new Error('Could not approve all logs. The operation was rolled back.')
	}
	return { approvedCount: logIds.length }
}
