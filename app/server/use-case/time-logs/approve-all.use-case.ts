import { z } from 'zod'
import { db } from '~/server/db'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { checkAuthentication } from '~/server/utils/check-authentication'
import { approveLogLogic } from './approve-single-log.use-case'
import type { Transaction } from 'kysely'
import type { DB } from '~/server/db/types'
import type { RequestContext } from '~/server/types/RequestContext'

// Schema for a single log within the bulk payload
const approveLogPayloadSchema = z.object({
	logId: z.string().min(1),
	admin_remarks: z.string().nullable().optional(),
})

// DTO Schema for the entire bulk operation
const bulkApproveSchema = z.object({
	logs: z.array(approveLogPayloadSchema).min(1, 'At least one log must be provided for approval.'),
})

const validateDTO = createSchemaValidator(bulkApproveSchema)
export type BulkApproveDTO = z.infer<typeof bulkApproveSchema>

// Result Type Definition
type BulkApproveResult = {
	success: true
	approvedCount: number
}

/**
 * Use case entry point for approving multiple time logs in a single transaction.
 * Handles authentication, input validation, and transaction management.
 */
export async function approveBulkLogsUseCase(dto: BulkApproveDTO, context: RequestContext): Promise<BulkApproveResult> {
	// 1. Get the payload from authentication. This could be a string OR an object.
	const authPayload = await checkAuthentication(context);

	let adminId: string;

	// 2. Perform a RUNTIME check to see what was actually returned.
	if (typeof authPayload === 'object' && authPayload !== null) {
		// If it's an object, we extract the 'userId' property.
		adminId = (authPayload as any).userId;
	} else {
		// If it's not an object, we trust it's the string we need.
		adminId = authPayload as string;
	}

	// 3. From this point on, 'adminId' is guaranteed to be the correct string ID.
	const { logs } = await validateDTO(dto);

	// 4. Start a transaction to ensure atomicity
	await db.transaction().execute(async (trx: Transaction<DB>) => {
		// Sequentially process each log to avoid race conditions on intern hours
		for (const log of logs) {
			// Now, the correct adminId string is passed into the core logic.
			await approveLogLogic(trx, context, log.logId, adminId, log.admin_remarks || null);
		}
	});

	// 5. Return a successful result
	return { success: true, approvedCount: logs.length };
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
