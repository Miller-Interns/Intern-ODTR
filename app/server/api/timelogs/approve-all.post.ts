import { approveBulkLogsUseCase, bulkApproveSchema } from '~/server/use-case/time-logs/approve-all.use-case'

export default defineEventHandler(async (event) => {
	// Proper authentication should be implemented here
	if (!event.context.auth?.id) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Authentication is required.',
		})
	}
	const adminId = event.context.auth.id

	const body = await readBody(event)
	const validatedBody = bulkApproveSchema.parse(body) // Use Zod to parse and validate

	await approveBulkLogsUseCase(validatedBody, adminId)

	return {
		success: true,
		message: `Successfully approved ${validatedBody.logs.length} logs.`,
	}
})



// import { z } from 'zod'
// import type { Transaction } from 'kysely'
// import type { DB } from '~/server/db/types'
// import { useApproveSingleLog } from '~/server/use-case/time-logs/approve-single-log.use-case'

// const approveLogSchema = z.object({
// 	logId: z.string().min(1, 'Log ID cannot be empty.'),
// 	admin_remarks: z.string().nullable().optional(),
// })

// const bulkApproveSchema = z.object({
// 	logs: z.array(approveLogSchema).min(1, 'At least one log is required.'),
// })

// export default defineEventHandler(async (event) => {
// 	try {
// 		// const adminId = event.context.user.id;
// 		const adminId = '015084bc-bec3-4373-aec3-729fba0a825a' //temporary

// 		const body = await readBody(event)
// 		const validation = bulkApproveSchema.safeParse(body)

// 		if (!validation.success) {
// 			const firstIssue = validation.error.issues[0]
// 			const errorMessage = firstIssue ? `${firstIssue.path.join('.')} - ${firstIssue.message}` : 'Invalid request body.'
// 			throw createError({
// 				statusCode: 400,
// 				statusMessage: errorMessage,
// 			})
// 		}

// 		const { logs } = validation.data

// 		await event.context.db.transaction().execute(async (trx: Transaction<DB>) => {
// 			for (const log of logs) {
// 				await useApproveSingleLog(trx, log.logId, log.admin_remarks || null, adminId)
// 			}
// 		})

// 		return {
// 			success: true,
// 			message: `Successfully approved ${logs.length} logs.`,
// 		}
// 	} catch (error: any) {
// 		if (error.statusCode) {
// 			throw error
// 		}

// 		console.error('Error in bulk-approve API:', error.message)
// 		throw createError({
// 			statusCode: 500,
// 			statusMessage: 'An internal server error occurred during bulk approval.',
// 		})
// 	}
// })
