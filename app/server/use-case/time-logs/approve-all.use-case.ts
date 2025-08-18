import { z } from 'zod'
import { db } from '~/server/db'
import type { Transaction } from 'kysely'
import type { DB } from '~/server/db/types'
import { approveSingleLogUseCase } from './approve-single-log.use-case'

export const approveLogPayloadSchema = z.object({
	logId: z.string().min(1),
	admin_remarks: z.string().nullable().optional(),
})

export const bulkApproveSchema = z.object({
	logs: z.array(approveLogPayloadSchema).min(1),
})

type BulkApproveDTO = z.infer<typeof bulkApproveSchema>

export async function approveBulkLogsUseCase(dto: BulkApproveDTO, adminId: string) {
	const { logs } = bulkApproveSchema.parse(dto) // Validate input at use case boundary

	await db.transaction().execute(async (trx: Transaction<DB>) => {
		for (const log of logs) {
			await approveSingleLogUseCase(trx, log.logId, log.admin_remarks || null, adminId)
		}
	})
}

// export async function approveAllLogs(db: Kysely<DB>, logIds: string[], remarks: string | null, adminId: string) {
// 	try {
// 		await db.transaction().execute(async (trx) => {
// 			const approvalJobs = logIds.map((id) => approveLog(trx, id, remarks, adminId))
// 			await Promise.all(approvalJobs)
// 		})
// 	} catch (error) {
// 		console.error('Transaction failed during bulk approval:', error)
// 		throw new Error('Could not approve all logs. The operation was rolled back.')
// 	}
// 	return { approvedCount: logIds.length }
// }
