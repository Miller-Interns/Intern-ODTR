import { z } from 'zod';
import { InternSchema, UserSchema, BatchSchema } from '../db/schema'
import { InternLogSchema } from '~/server/response/time-log.response'

export const InternWithDetailsSchema = InternSchema
	.omit({ hours_completed: true })
	.extend({
		user: z.object({
			name: UserSchema.shape.name,
			email: UserSchema.shape.email,
		}),
		batch: z.object({
			batch_number: BatchSchema.shape.batch_number,
		}),
		completed_hours: z.number(),
		remaining_hours: z.number(),
	})

export const InternDetailsResponseSchema = z.object({
	intern: InternWithDetailsSchema,
	timeLogs: z.array(InternLogSchema),
})

export type InternWithDetails = z.infer<typeof InternWithDetailsSchema>
export type InternDetailsResponse = z.infer<typeof InternDetailsResponseSchema>