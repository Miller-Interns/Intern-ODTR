import { z } from 'zod'
import { approveSingleLog } from '~/server/use-case/time-logs/approve-single-log.use-case'
import { db } from '~/server/db'
import type { RequestContext } from '~/server/types/RequestContext';
// import { approveLogPayloadSchema } from '~/server/use-case/time-logs/approve-all.use-case'
import type { ApproveSingleLogDTO } from '~/server/use-case/time-logs/approve-single-log.use-case'

const approveLogBodySchema = z.object({
	logId: z.string(),
	admin_remarks: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
	// Proper authentication should be implemented here
	const body = await readBody(event)
	const parsedBody = approveLogBodySchema.parse(body)

	const dto: ApproveSingleLogDTO = {
		logId: parsedBody.logId,
		admin_remarks: parsedBody.admin_remarks,
	}

	const useCaseContext: RequestContext = {
		auth: event.context.auth ?? {},
	}

	const result = await approveSingleLog(dto, useCaseContext)
	return result
})


// const approveLogSchema = z.object({
// 	logId: z.string().min(1, 'Log ID cannot be empty.'),
// 	admin_remarks: z.string().nullable().optional(),
// })

// export default defineEventHandler(async (event) => {
// 	try {
// 		// if (!event.context.user) {
// 		//   throw createError({
// 		//     statusCode: 401,
// 		//     statusMessage: 'Authentication is required to perform this action.',
// 		//   });
// 		// }

// 		// const adminId = event.context.user.id;
// 		const adminId = '015084bc-bec3-4373-aec3-729fba0a825a'

// 		const body = await readBody(event)
// 		const validation = approveLogSchema.safeParse(body)

// 		if (!validation.success) {
// 			const firstIssue = validation.error.issues[0]
// 			if (firstIssue) {
// 				const errorMessage = `${firstIssue.path.join('.')} - ${firstIssue.message}`
// 				throw createError({
// 					statusCode: 400,
// 					statusMessage: errorMessage,
// 				})
// 			} else {
// 				throw createError({
// 					statusCode: 400,
// 					statusMessage: 'Invalid request body.',
// 				})
// 			}
// 		}

// 		const { logId, admin_remarks } = validation.data
// 		await useApproveSingleLog(event.context.db, logId, admin_remarks || null, adminId)
// 		return { success: true, message: 'Log updated successfully.' }
// 	} catch (error: any) {
// 		if (!error.statusCode) {
// 			console.error('Error in approve-log API:', error.message)
// 			throw createError({ statusCode: 500, statusMessage: 'An internal server error occurred.' })
// 		}
// 		throw error
// 	}
// })
