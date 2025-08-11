import { z } from 'zod'
import { useApproveAllLogs } from '~/server/use-cases/useApproveAll'

const approveAllSchema = z.object({
	logIds: z.array(z.string().min(1)).min(1, 'At least one log ID is required.'),
	admin_remarks: z.string().nullable().optional(), // Changed from 'remarks'
})

export default defineEventHandler(async (event) => {
	try {
		// if (!event.context.auth || !event.context.auth.userId) {
		//   throw createError({
		//     statusCode: 401,
		//     statusMessage: 'Authentication is required to perform this action.',
		//   });
		// }

		// const adminId = event.context.auth.userId;
		const adminId = '015084bc-bec3-4373-aec3-729fba0a825a'

		const body = await readBody(event)
		const validation = approveAllSchema.safeParse(body)

		if (!validation.success) {
			const firstIssue = validation.error.issues[0]
			const errorMessage = firstIssue ? `${firstIssue.path.join('.')} - ${firstIssue.message}` : 'Invalid request body.'
			throw createError({
				statusCode: 400,
				statusMessage: errorMessage,
			})
		}

		const { logIds, admin_remarks } = validation.data
		const result = await useApproveAllLogs(event.context.db, logIds, admin_remarks || null, adminId)

		return {
			success: true,
			message: `Successfully approved ${result.approvedCount} logs.`,
		}
	} catch (error: any) {
		if (error.statusCode) {
			throw error
		}

		console.error('Error in approve-all API:', error.message)
		throw createError({
			statusCode: 500,
			statusMessage: 'An error occurred during bulk approval.',
		})
	}
})
