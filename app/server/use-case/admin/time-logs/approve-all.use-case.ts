import { z } from 'zod'
import { db } from '~/server/db'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { checkAuthentication } from '~/server/utils/check-authentication'
import { approveLogLogic } from './approve-single-log.use-case'
import type { Transaction } from 'kysely'
import type { DB } from '~/server/db/types'
import type { RequestContext } from '~/server/types/RequestContext'

const approveLogPayloadSchema = z.object({
	logId: z.string().min(1),
	admin_remarks: z.string().nullable().optional(),
})

const bulkApproveSchema = z.object({
	logs: z.array(approveLogPayloadSchema).min(1, 'At least one log must be provided for approval.'),
})

const validateDTO = createSchemaValidator(bulkApproveSchema)
export type BulkApproveDTO = z.infer<typeof bulkApproveSchema>

type BulkApproveResult = {
	success: true
	approvedCount: number
}

export async function approveBulkLogsUseCase(dto: BulkApproveDTO, context: RequestContext): Promise<BulkApproveResult> {
	const authPayload = await checkAuthentication(context)

	let adminId: string

	if (typeof authPayload === 'object' && authPayload !== null) {
		adminId = (authPayload as any).userId
	} else {
		adminId = authPayload as string
	}

	const { logs } = await validateDTO(dto)
	await db.transaction().execute(async (trx: Transaction<DB>) => {
		for (const log of logs) {
			await approveLogLogic(trx, context, log.logId, adminId, log.admin_remarks || null)
		}
	})
	return { success: true, approvedCount: logs.length }
}
