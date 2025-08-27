import { z } from 'zod'
import { BatchSchema,UserSchema } from '~/server/db/schema'

export const ResponseUserFullSchema = z.object({
    id: BatchSchema.shape.id,
    batch_number: BatchSchema.shape.batch_number,
    start_date: BatchSchema.shape.start_date,
    status: BatchSchema.shape.status,
    supervisorId: UserSchema.shape.id
})

export type ResponseUserFull = z.infer<typeof ResponseUserFullSchema>
